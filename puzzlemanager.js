class PuzzleManager {
    constructor() {
        this.puzzles = [];
        this.retrieveAllPuzzles();
    }

    /**
     * Save a single puzzle
     * 
     * @param {string} title 
     * @param {Object} puzzle 
     */
    storePuzzle(title, puzzle) {
        if (title) {
            this.puzzles[title] = puzzle.serialize();
        }
        this.saveAllPuzzles();
    }

    /**
     * Save all puzzles into local storage
     * @param {Array} puzzles 
     */
    saveAllPuzzles() {
        window.localStorage.setItem('Puzzles', JSON.stringify(this.puzzles));
    }

    /**
     * Get all the Puzzles from local storage into an array
     */
    retrieveAllPuzzles() {
        const puzzleString = window.localStorage.getItem('Puzzles');
        this.puzzles = JSON.parse(puzzleString);
    }

    /**
     * Get a single puzzle
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
}