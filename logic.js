/* OBJECTS */ 

// GameBoard module
const gameBoard = (() => {
	const matrix = [1,0,1,0,0,1,1,0,1];
	
	return { matrix };
})();

// DisplayController module
const displayController = (() => {
	const render = () => {
		const gameBoardDiv = document.querySelector(".game-board");

		for (let i = 0; i < 9; i++) {
			const cell = document.createElement("div");
			cell.classList.add("game-cell");

			const cellContent = document.createElement("span");
			cellContent.textContent = gameBoard.matrix[i] ? "X" : "O";
			cell.appendChild(cellContent);
			
			gameBoardDiv.appendChild(cell);
		}
	};

	return { render };

})();

// Player factory function
const player = (name) => {
	let score = 0;

	return { name };
}; 

displayController.render();
