/**
 * empty = -1
 * O = 0
 * X = 1
 */
$(document).ready(function() {

	/* OBJECTS */ 

	// Player factory function
	const player = (playerToken) => {
		const token = playerToken;
		let score = 0;
		
		const markAt = (pos) => {
			gameBoard.getMatrix()[pos] = token;

		};

		return { markAt };
	}; 


	// Game module
	const game = (() => {
		let currentPlayer = 0;
		const playerO = player(0);
		const playerX = player(1);	
		const currentWinState = [];
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

		const isGameOver = () => {
			const boardMatrix = gameBoard.getMatrix();

			currentWinState.push(...winStates.filter( // update current win state, if able 
				winState => winState.every(
					pos => boardMatrix[pos] !== -1 && boardMatrix[winState[0]] === boardMatrix[pos]
				)
			));

			if (currentWinState.length !== 0) { // check to see if win state exists
				return true;
			} else {
				return false;
			}
		};

		const playTurn = (pos) => {		
			if (currentPlayer) {
				playerX.markAt(pos);
			} else {
				playerO.markAt(pos);
			}

			currentPlayer = Number(!currentPlayer);
		};

		return { getCurrentPlayer, isGameOver, playTurn };
	})();


	// GameBoard module
	const gameBoard = (() => {
		const matrix = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
		
		const getMatrix = () => matrix;

		return { getMatrix };
	})();



	// DisplayController module
	const displayController = (() => {
		
		const render = () => {
			for (let i = 0; i < 9; i++) {
				const cell = $("<div>").click(_markCell);
				cell.text(_numToToken(gameBoard.getMatrix()[i]));				
				cell.addClass("game-cell");
			  $(".game-board").append(cell);
			}
		};

		const _numToToken = (num) => { 
			return num === -1 ? "" : num ? "X" : "O";
		};

		const _markCell = (e) => {
			let cell = $(e.target);
			
			if (cell.text() !== "") return;

			cell.text(_numToToken(game.getCurrentPlayer()));			
			cell.addClass(cell.text() === "X" ? "x-token" : "y-token");	
			game.playTurn(cell.index());

			if (game.isGameOver()) {
				$(".game-board").children().off("click"); // remove all click handlers
				// setInterval(_blink, 300);
			}	
				// render gameover screen (flashing os?)
				// render a button to play again
				// prevent grid from being pressed
			
		};

		// const _blink = () => {
		// 	if 
		// }



		return { render };
	})();		

	displayController.render();
});







/**
 * Things I want to do/change
 * - find different mapping for tokens, I don't like X = 1, O = 2 I want it to be binary
 * - css issue when all cells are initially empty, line-height makes cells too big 
 * - implement proper jQuery in markCell function ($(this) is not working)
 * - add tie implementation 
 * 
 * Things I learned
 * - modules
 * - factory functions
 * - avoiding populating global namespace 
 * - using jQuery to simplify DOM manipulation (makes code much more succint)
 * 
 * Problems I faced
 * - clicking on a cell wouldn't give me its correct position in respect to its pos in game board children divs.
 * - 		problem was because there are also spans inside the divs, so clicking on span would just return 0 instead of cell index
 * -    	tried to initially fix by checking to see whether span or div was clicked, and making proper adjustments to parentNode calls
 * - 			was so messy, so i tried ...
 * 
 * - when I tried to access game.currentPlayer, I would always get 1 even though i had a function call that should change it to 2
 * - 		apparently when you properties put into returned objects stay constant, unless you specifically modify that object.
 * -  	if you modify via a function, it does not modify it, modifys the variable inside the function scope
 * -  	this is really confusing, go check out objects_practice example to refresh ur memory
 * 
 * - figuring out which module each piece of logic should go to
 * 
 * - have two click listeners for cell, not sure how to combine them/which module they should be in
 * 
 * - can't figure out how to pass in an already declared callback function into .click(), and have access to the targetted DOM node using $(this). 
 * 			I can only do it using e.currentTarget, but I dont know why $(this) isn't working sigh
 */