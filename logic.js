/**
 * empty = -1
 * O = 0
 * X = 1
 */



$(document).ready(function() {	

	/**
	 * Player factory function
	 * @desc a player that has a x/o token
	 */
	const player = (playerToken) => {
		const token = playerToken;
		let score = 0;
		
		const markAt = (pos) => {
			gameBoard.getMatrix()[pos] = token;

		};

		return { markAt };
	}; 


	/**
	 * Game Module
	 * @desc included vars + fns deal with game state and logic
	 */
	const game = (() => {
		let currentWinState = null; 
		let currentPlayer = 0;
		const playerO = player(0);
		const playerX = player(1);		
		const winStates = [
			[0,1,2],
			[3,4,5],
			[6,7,8],
			[0,3,6],
			[1,4,7],
			[2,5,8],
			[0,4,8],
			[2,4,6] 
		];	

		const getCurrentPlayer = () => currentPlayer;
		const getCurrentWinState = () => currentWinState;

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
			} else if (isTie()) {
				return true 
			} else {
				return false;
			}					
		};

		const isTie = () => { 
			return !gameBoard.getMatrix().some(pos => pos === -1); // return true if all cells are filled
		}

		const playTurn = (pos) => {		
			currentPlayer ? playerX.markAt(pos) : playerO.markAt(pos);

			currentPlayer = Number(!currentPlayer);
		};

		return { 
			getCurrentPlayer,
			getCurrentWinState,
			reset,
			isGameOver,
			playTurn };
	})();


	/**
	 * Game Board Module
	 * @desc contains game board data and fns
	 */
	const gameBoard = (() => {
		const matrix = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
		
		const getMatrix = () => matrix;

		const reset = () => {
			for (let i = 0; i < matrix.length; i++) {
				matrix[i] = -1;
			}
		};

		return { getMatrix, reset };
	})();



	/**
	 * Display Controller Module
	 * @desc included fns manipulate and render DOM 
	 */
	const displayController = (() => {
		let blinker = null;
		
		const render = () => {
			for (let i = 0; i < 9; i++) { // render initial empty game board
				const cell = $("<div>").click(_markCell);
				cell.text(_numToTokenString(gameBoard.getMatrix()[i]));				
				cell.addClass("game-cell");
			  $(".game-board").append(cell);
			}

			$(".reset-btn").click(_reset);
		};

		const _reset = (e) => {
			game.reset();
			$(".game-board").children().text("");
			$(".game-board").children().attr("class", "game-cell"); // reset all cell classes
			$(".game-board").children().click(_markCell); 
			$(".reset-btn").text("Reset");

			$(".msg-panel .intro-display").css("display", "inline");
			$(".msg-panel .turn-display").text((_numToTokenEmoji(game.getCurrentPlayer())) + " goes first!");

			clearInterval(blinker); // stop interval
		};

		const _markCell = (e) => {
			let cell = $(e.target);
			
			if (cell.text() !== "") return;

			cell.text(_numToTokenString(game.getCurrentPlayer()));	// mark cell in GUI			
			cell.addClass(cell.text() === "X" ? "x-token" : "y-token");	
			game.playTurn(cell.index());	// mark cell in model

			$(".msg-panel .intro-display").css("display", "none"); 
			$(".msg-panel .turn-display").text("It's " + (_numToTokenEmoji(game.getCurrentPlayer())) + "'s turn");

			if (game.isGameOver()) _renderGameOver();																			
		}; 

		const _renderGameOver = () => {
			$(".game-board").children().off("click"); 
			$(".reset-btn").text("New Game");
			
			if (game.getCurrentWinState() === null) {
				$(".msg-panel .turn-display").text("It's a tie... 😅");
			} else {
				$(".msg-panel .turn-display").text(_numToTokenEmoji(!game.getCurrentPlayer()) + " won!!!");
				blinker = setInterval(_blink, 300);	// three winning tokens blink repeatedly 	
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







