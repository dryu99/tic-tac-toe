/**
 * empty = 0
 * X = 1
 * O = 2
 */

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

	const getCurrentPlayer = () => currentPlayer;

	const playTurn = (pos) => {		
		if (currentPlayer) {
			playerX.markAt(pos);
		} else {
			playerO.markAt(pos);
		}

		currentPlayer = Number(!currentPlayer);
		console.log("playTurn done");
	};

	return { playTurn, getCurrentPlayer };

})();

// GameBoard module
const gameBoard = (() => {
	const matrix = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
	
	const getMatrix = () => matrix;

	return { getMatrix };
})();

// DisplayController module
const displayController = (() => {

	const _numToToken = (num) => { 
	  return num === -1 ? "" : num ? "X" : "O";
	};

	const _markCell = (e) => {
		if (e.target.textContent !== "") return;

		let pos = e.target.nodeName.toLowerCase() === "span" ? Array.prototype.indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode) :
			Array.prototype.indexOf.call(e.target.parentNode.children, e.target); // this is terrible change div/span selection logic
		game.playTurn(pos);

		e.target.textContent = _numToToken(game.getCurrentPlayer()); 
		console.log("markCell done");
	};

	const render = () => {
		const gameBoardDiv = document.querySelector(".game-board");

		for (let i = 0; i < 9; i++) {
			const cell = document.createElement("div");
			cell.classList.add(`game-cell`);
			cell.textContent = _numToToken(gameBoard.getMatrix()[i]);
			// cell.id = i;
			cell.addEventListener("click", _markCell);

			gameBoardDiv.appendChild(cell);
		}
	};

	return { render };

})();



displayController.render();


/**
 * Things I want to do/change
 * - find different mapping for tokens, I don't like X = 1, O = 2 I want it to be binary
 * - css issue when all cells are initially empty, line-height makes cells too big 
 * 
 * Things I learned
 * - modules
 * - factory functions
 * - avoiding populating global namespace 
 * 
 * Problems I faced
 * - clicking on a cell wouldn't give me its correct position in respect to its pos in game board children divs.
 * - 		problem was because there are also spans inside the divs, so clicking on span would just return 0 instead of cell index
 * -    	tried to initially fix by checking to see whether span or div was clicked, and making proper adjustments to parentNode calls
 * - 			was so messy, so i tried ...
 * - when I tried to access game.currentPlayer, I would always get 1 even though i had a function call that should change it to 2
 * - 		apparently when you properties put into returned objects stay constant, unless you specifically modify that object.
 * -  	if you modify via a function, it does not modify it, modifys the variable inside the function scope
 * -  	this is really confusing, go check out objects_practice example to refresh ur memory
 * - figuring out which module each piece of logic should go to
 * - have two click listeners for cell, not sure how to combine them/which module they should be in
 *
 */