$(document).ready(function() {	

	/**
	 * Game Module
	 * @desc included vars + fns deal with game state and logic
	 */
	const game = (() => {
		let currentPlayer = 0;
		let currentWinState = null; 
		let computerPlaying = true;	
		const winStates = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
											 [0,4,8], [1,4,7], [2,4,6], [2,5,8]];	

		const getCurrentPlayer = () => currentPlayer;
		const getCurrentWinState = () => currentWinState;

		const isComputerPlaying = (...args) => {
			if (args.length === 0) {	// if no args, return opponent state, ow set opponent state 
				return computerPlaying;
			} else {
				computerPlaying = args[0];	
			}			
		};

		const reset = () => {
			currentWinState = null;
			gameBoard.reset();
		}

		const isGameOver = () => {
			const boardMatrix = gameBoard.getMatrix();

			let currentState = winStates.filter( // determine current game state, if able 
				winState => winState.every(
					pos => boardMatrix[pos] !== -1 && boardMatrix[winState[0]] === boardMatrix[pos]
				)
			);

			if (currentState.length !== 0) { // check to see if win state exists in current game state
				currentWinState = currentState[0]; // update win state
				return true;
			} else if (_isTie()) {
				return true 
			} else {
				return false;
			}					
		};

		const _isTie = () => { 
			return !gameBoard.getMatrix().some(pos => pos === -1); // return true if all cells are filled
		}


		// TODO: Have to change this function into a play round function, plays human turn and play computers turn
		const playTurn = (pos) => {		
			currentPlayer ? gameBoard.setTokenAt(pos,1) : gameBoard.setTokenAt(pos,0);

			currentPlayer = Number(!currentPlayer);
		};

		return { 
			getCurrentPlayer,
			getCurrentWinState,
			isComputerPlaying,
			reset,
			isGameOver,
			playTurn };
	})();


	/**
	 * Game Board Module
	 * @desc contains game board data and fns that manipulate it
	 * @tokenLegend -1 = empty, 0 = O, 1 = X
 	 */	 
	const gameBoard = (() => {
		const matrix = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
		
		const getMatrix = () => matrix;

		const getTokenAt = (pos) => { 
			return matrix[pos]; 
		}

		const setTokenAt = (pos, token) => {
			matrix[pos] = token;
		}

		const reset = () => {
			matrix.fill(-1);
		};

		return { 
				getMatrix,
				getTokenAt,
				setTokenAt,
				reset };
	})();


	/**
	 * Display Controller Module
	 * @desc included fns manipulate and render DOM 
	 */
	const displayController = (() => {
		let _blinker = null;
		
		const render = () => {
			for (let i = 0; i < 9; i++) { // render initial empty game board
				const cell = $("<div>").text(_numToTokenString(gameBoard.getMatrix()[i])); 
				cell.addClass("game-cell");										
			  $(".game-board").append(cell);
			}			

			$(".reset-btn").click(_reset); // register listeners
			$(".play-human-btn").click(_playAgainstHuman);
			$(".play-comp-btn").click(_playAgainstComputer);
		};

		const _reset = (e) => {			
			if ($(".reset-btn").text() === "New Game") { 
				$(".opponent-panel").css("display", "block");  // return to opponent select screen
				$(".info-panel").css("display", "none");				
			} 

			$(".intro-display").css("display", "inline"); // reset intro messages
			if (game.isComputerPlaying()) {
				$(".turn-display").text("You go first!");
			} else {
				$(".turn-display").text((_numToTokenEmoji(game.getCurrentPlayer())) + " goes first!");
			}
			

			$(".game-cell").text(""); // reset game board
			$(".game-cell").attr("class", "game-cell"); 
			if ($(".reset-btn").text() === "Reset") $(".game-cell").click(_playRound);
			$(".reset-btn").text("Reset");

			game.reset(); // reset game data
			clearInterval(_blinker); // stop interval
		};

		const _playAgainstHuman = (e) => {
			game.isComputerPlaying(false);
			$(".opponent-panel").css("display", "none");
			$(".info-panel").css("display", "block");
			$(".game-cell").click(_playRound);  // enable cells to be clicked

			$(".turn-display").text((_numToTokenEmoji(game.getCurrentPlayer())) + " goes first!");
		}

		const _playAgainstComputer = (e) => {
			game.isComputerPlaying(true);
			$(".opponent-panel").css("display", "none");
			$(".info-panel").css("display", "block");
			$(".game-cell").click(_playRound);  // enable cells to be clicked

			$(".turn-display").text("You go first!");
		}

		const _playRound = (e) => {
			if ($(e.target).text() === "") { // if clicked cell is empty, play a round
				_markCell($(e.target)); 
				_updateMsgPanel(); 
				if (game.isGameOver()) {
					_renderGameOver(false);
					return;
				}				

				if (game.isComputerPlaying()) { // if comp state on, play comp's turn
					_renderComputerTurn(); 

					if (game.isGameOver()) {
						_renderGameOver(true);
						return;
					}
				}				
			}			
		};

		const _markCell = (cell) => { // given cell must be a jQuery object
			cell.text(_numToTokenString(game.getCurrentPlayer()));	// mark cell in GUI			
			cell.addClass(game.getCurrentPlayer() === 1 ? "x-token" : "y-token");	
			game.playTurn(cell.index());	// mark cell in game data			
		};
		
		const _updateMsgPanel = () => {
			if ($(".intro-display").css("display") !== "none") // if intro display not hidden, hide it				
				$(".intro-display").css("display", "none"); 											

			if (game.isComputerPlaying()) {
				let text = "";

				switch (Math.floor(Math.random() * 3)) {
					case 0:
						text = "Make your move!";
						break;
					case 1:
						text = "Nice move...";	
						break;
					default:
						text = "Coolio movio";
				}
				$(".turn-display").text(text);	
			} else {
				$(".turn-display").text("It's " + (_numToTokenEmoji(game.getCurrentPlayer())) + "'s turn");
			}			
		};		 

		const _renderGameOver = (didCompWin) => {
			$(".game-cell").off("click"); 
			$(".reset-btn").text("New Game");
			
			if (game.getCurrentWinState() === null) {
				$(".turn-display").text("It's a tie... 😅");
			} else {
				if (!didCompWin && game.isComputerPlaying()) { 				// if you won and playing against comp
					$(".turn-display").text("You won!!!");					
				} else if (didCompWin && game.isComputerPlaying()) { 	// if comp won
					$(".turn-display").text("The computer won...");										
				} else {																							// if playing against human
					$(".turn-display").text(_numToTokenEmoji(!game.getCurrentPlayer()) + " won!!!");
				}
				
				_blinker = setInterval(_blink, 300);	// three winning tokens blink repeatedly 	
			}											
		};

		const _renderComputerTurn = () => {
			while (true) {
				let computerPos = Math.floor(Math.random() * 9);

				if (gameBoard.getTokenAt(computerPos) === -1) {
					_markCell($(".game-cell").eq(computerPos));					
					break;
				}
			} 
		};

		const _blink = () => { 			
			game.getCurrentWinState().forEach(index => {
				$(".game-cell").eq(index).toggleClass("hidden"); 
			}); 
		};

		const _numToTokenString = (num) => { 
			return num === -1 ? "" : num ? "X" : "O";
		};

		const _numToTokenEmoji = (num) => { 
			return num == 0 ? "⭕" : "❌"; // soft comparison in case I want to pass in opposite val
		};

		return { render };
	})();		

	displayController.render();
});







