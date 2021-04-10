class PuzzleManager {
    constructor() {
        this.puzzles = [];
        this.retrieveAllPuzzles();
    }

    /**
     * Save a single puzzle to the Puzzle List
     *
     * @param {string} title
     * @param {Object} puzzle
     */
    storePuzzle(title, puzzle) {
        if (title) {
            this.puzzles[title] = puzzle.serialize();
        }
		
		// Automatically save puzzles to local storage
        this.saveAllPuzzles();
    }

    /**
     * Save all puzzles into local storage
     * @param {Array} puzzles
     */
    saveAllPuzzles() {
        const allPuzzles = [];
        for (const key of Object.keys(this.puzzles)) {
            allPuzzles.push(this.puzzles[key]);
        }
        window.localStorage.setItem('Puzzles', JSON.stringify(allPuzzles));
    }
	
    /**
     * Get all the Puzzles from local storage into an array
     */
    retrieveAllPuzzles() {
        const puzzleString = window.localStorage.getItem('Puzzles');
        if (typeof puzzleString == "string" && puzzleString.length > 0) {
            // get an array of strings
            const puzzleItems = JSON.parse(puzzleString);
            for (const item of puzzleItems) {
                if (item) {
                    const puz = new Puzzle();
                    puz.unserialize(JSON.parse(item));
                    this.puzzles[puz.title] = puz;
                }
            }
        }
    }

    /**
     * Get a single puzzle from the Puzzle List
     * @param {string} title
     * @returns
     */
    getPuzzle(title) {
        let result = null;

        if (this.puzzles[title]) {
            const result = new Puzzle();
            result.unserialize(this.puzzles[title]);
        }

        return result;
    }

	/**
	 * Delete a puzzle from the Puzzle List
	 *
	 */
    deletePuzzle(title) {
        if (this.puzzles[title]) {
            delete(this.puzzles[title]);
			this.saveAllPuzzles();
        }
    }
}