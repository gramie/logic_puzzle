class PuzzleManager {
    constructor() {
        this.puzzles = [];
        this.retrieveAllPuzzles();
    }

    storePuzzle(title, puzzle) {
        if (title) {
            this.puzzles[title] = puzzle.serialize();
        }
        this.saveAllPuzzles(storagePuzzles);
    }

    saveAllPuzzles(puzzles) {
        window.localStorage.setItem('Puzzles', JSON.stringify(storagePuzzles));
    }

    retrieveAllPuzzles() {
        const puzzleString = window.localStorage.getItem('Puzzles');
        this.puzzles = JSON.parse(puzzleString);
    }

    getPuzzle(title) {
        let result = null;

        if (this.puzzles[title]) {
            const result = new Puzzle();
            result.unserialize(this.puzzles[title]);
        }

        return result;
    }
}