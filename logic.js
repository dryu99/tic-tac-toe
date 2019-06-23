$(document).ready(function() {	

	/**
	 * Player factory function
	 * @desc a player that has a x/o token
	 */
	const player = (playerToken) => {
		const token = playerToken;
		let score = 0;
		
		const setgetTokenAt = (pos) => {
			gameBoard.getMatrix()[pos] = token;
		};

		return { setgetTokenAt };
	}; 


	/**
	 * Game Module
	 * @desc included vars + fns deal with game state and logic
	 */
	const game = (() => {
		let currentPlayer = 0;
		let currentWinState = null; 
		let computerPlaying = true;
		// const playerO = player(0);
		// const playerX = player(1);		
		const winStates = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
											 [0,4,8], [1,4,7], [2,4,6], [2,5,8]];	

		const getCurrentPlayer = () => currentPlayer;
		const getCurrentWinState = () => currentWinState;
		const isComputerPlaying = () => computerPlaying;

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

			$(".game-cell").click(_playRound); // register listeners
			$(".reset-btn").click(_reset);
		};

		const _playRound = (e) => {
			if ($(e.target).text() === "") { // if clicked cell is empty, play a round
				_markCell($(e.target)); 
				_updateMsgPanel(); 
				if (game.isGameOver()) {
					_renderGameOver();
					return;
				}				

				if (game.isComputerPlaying()) { // if comp state on, play comp's turn
					_renderComputerTurn(); 

					if (game.isGameOver()) {
						_renderGameOver();
						return;
					}
				}				
			}			
		};

		const _reset = (e) => {			
			$(".game-cell").text(""); // reset GUI
			$(".game-cell").attr("class", "game-cell"); 
			$(".game-cell").click(_playRound);
			$(".reset-btn").text("Reset");
			game.reset(); // reset game data

			$(".intro-display").css("display", "inline"); // reset message panel 
			$(".turn-display").text((_numToTokenEmoji(game.getCurrentPlayer())) + " goes first!");

			clearInterval(_blinker); // stop interval
		};

		const _markCell = (cell) => { // given cell must be a jQuery object
			cell.text(_numToTokenString(game.getCurrentPlayer()));	// mark cell in GUI			
			cell.addClass(game.getCurrentPlayer() === 1 ? "x-token" : "y-token");	
			game.playTurn(cell.index());	// mark cell in game data			
		};
		
		const _updateMsgPanel = () => {
			if ($(".intro-display").css("display") !== "none") // if intro display not hidden, hide it				
				$(".intro-display").css("display", "none"); 											

			$(".turn-display").text("It's " + (_numToTokenEmoji(game.getCurrentPlayer())) + "'s turn");
		};		 

		const _renderGameOver = () => {
			$(".game-cell").off("click"); 
			$(".reset-btn").text("New Game");
			
			if (game.getCurrentWinState() === null) {
				$(".msg-panel .turn-display").text("It's a tie... 😅");
			} else {
				$(".msg-panel .turn-display").text(_numToTokenEmoji(!game.getCurrentPlayer()) + " won!!!");
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







