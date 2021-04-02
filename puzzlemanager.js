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
                    puz.unserialize(item);
                    this.puzzles[item.title] = puz;
                }
            }
        }
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

    deletePuzzle(title) {
        if (this.puzzles[title]) {
            delete(this.puzzles[title]);
        }
    }
}