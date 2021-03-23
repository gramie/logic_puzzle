class Cell {
    constructor(defaultColour) {
        this.colour = defaultColour;
    }

    setColour(newColour) {
        this.colour = newColour;
    }

    getColour() {
        return this.colour;
    }
}

class Puzzle {
    constructor() {
        this.title = '';
        this.cells = [];
        this.rowNumbers = [];
        this.maxRowNumbers;
        this.colNumbers = [];
        this.maxColNumbers;
        this.currentMouseCol = -1;
        this.currentMouseRow = -1;
        this.currentPaintCol = null;
        this.currentPaintRow = null;
        this.currentPaintDirection = null;
        this.currentPaintColour = null;
    }

    import(puzzleText) {
        const lines = puzzleText.split("\n");
        const rowNumbers = [];
        const colNumbers = [];
        let row = 0;
        while (row < lines.length && lines[row] != '') {
            rowNumbers.push(lines[row].split(','));
            row++;
        }
        row++;
        while (row < lines.length && lines[row] != '') {
            colNumbers.push(lines[row].split(','));
            row++;
        }
        this.setSize(colNumbers, rowNumbers);
    }

    setMaxNumbers() {
        this.maxColNumbers = 0;
        for (const col of this.colNumbers) {
            if (col.length > this.maxColNumbers) {
                this.maxColNumbers = col.length;
            }
        }
        this.maxRowNumbers = 0;
        for (const row of this.rowNumbers) {
            if (row.length > this.maxRowNumbers) {
                this.maxRowNumbers = row.length;
            }
        }

    }

    setSize(colNumbers, rowNumbers) {
        this.width = colNumbers.length;
        this.height = rowNumbers.length;
        this.colNumbers = colNumbers;
        this.rowNumbers = rowNumbers;
        this.setMaxNumbers();

        this.cells = [];
        for (let row = 0; row < this.height; row++) {
            const rowArray = [];
            for (let col = 0; col < this.width; col++) {
                const colour = Math.random() > 0.5 ? 'empty' : 'filled';
                rowArray[col] = new Cell(colour);
            }
            this.cells[row] = rowArray;
        }
    }

    render() {
        let result = '';
        result += '<table>';

        // Top numbers
        for (let numRow = 0; numRow < this.maxColNumbers; numRow++) {
            result += '<tr>';

            result += '<th colspan="' + this.maxRowNumbers + '">&nbsp;</th>';

            for (let numCol = 0; numCol < this.width; numCol++) {
                const currentColNumbers = this.colNumbers[numCol];
                const numberIndex = numRow + currentColNumbers.length - this.maxColNumbers;
                const number = numberIndex >= 0 ? currentColNumbers[numberIndex] : '';
                result += '<th>' + number + '</th>';
            }

            result += '</tr>';
        }

        // Main body
        for(let idx = 0; idx < this.cells.length; idx++) {
            const row = this.cells[idx];
            result += '<tr>';

            // Side numbers
            for (let col = 0; col < this.maxRowNumbers; col++) {
                const currentRowNumbers = this.rowNumbers[idx];
                const numberIndex = col + currentRowNumbers.length - this.maxRowNumbers;
                const number = numberIndex >= 0 ? currentRowNumbers[numberIndex] : '';

                result += '<th>' + number + '</th>';
            }

            // Actual picture grid
            for(const col in row) {
                const cell = row[col];
                const cellClass = cell.getColour();
                result += '<td class="' + cellClass + '" data-row="' + idx + '" data-col="' + col + '">&nbsp;</td>';
            }
            result += "</tr>\n";
        }
        result += '</table>';

        return result;
    }


    getCell(row, col) {
        return this.cells[row][col];
    }

    getCellFromMouseClick(node) {
        const row = node.data('row');
        const col = node.data('col');

        return this.getCell(row, col);
    }

    leftMouseDown(node) {
        const cell = this.getCellFromMouseClick(node);

        this.currentMouseCol = node.data('col');
        this.currentMouseRow = node.data('row');
        if (cell.getColour() == 'empty') {
            node.removeClass(cell.getColour());
            cell.setColour('filled');
            node.addClass(cell.getColour());
        } else {
            node.removeClass(cell.getColour());
            cell.setColour('empty');
            node.removeClass(cell.getColour());
        }
        this.currentPaintColour = cell.getColour();
    }

    mouseMove(node) {
        const mouseRow = node.data('row');
        const mouseCol = node.data('col');


        if (this.currentPaintColour) {
            const dx = mouseCol != this.currentMouseCol;
            const dy = mouseRow != this.currentMouseRow;

            if (!this.currentPaintDirection) {
                if (dx) {
                    this.currentPaintDirection = 'h';
                    this.currentPaintRow = mouseRow;
                } else if (dy) {
                    this.currentPaintDirection = 'v';
                    this.currentPaintCol = mouseCol;
                }
            }

            if ((this.currentPaintDirection == 'h' && this.currentPaintRow == mouseRow && dx)
              || (this.currentPaintDirection == 'v' && this.currentPaintCol == mouseCol && dy)) {
                // We have moved to a new cell in the current Row or Col
                const cell = this.getCellFromMouseClick(node);
                const origColour = cell.getColour();
                if (origColour != this.currentPaintColour) {
                    cell.setColour(this.currentPaintColour);
                    node.removeClass(origColour);
                    node.addClass(this.currentPaintColour);
                }
            }
        }
        this.currentMouseRow = mouseRow;
        this.currentMouseCol = mouseCol;

    }

    mouseUp(node) {
        this.currentPaintColour = null;
        this.currentPaintDirection = null;
        this.currentPaintCol = null;
        this.currentPaintRow = null;
    }

    unserialize(puzzleData) {
        const puzzleVariables = JSON.parse(puzzleData);
        this.title = puzzleVariables.title;
        this.rowNumbers = puzzleVariables.rowNumbers;
        this.height = puzzleVariables.rowNumbers.length;
        this.colNumbers = puzzleVariables.ColNumbers;
        this.width = puzzleVariables.colNumbers.length;
        this.setMaxNumbers();
        this.cells = puzzleVariables.cells;
    }

    serialize() {
        const puzzle = {
            title : this.title,
            width : this.width,
            height : this.height,
            rowNumbers : this.rowNumbers,
            colNumbers : this.colNumbers,
            cells : this.cells
        };

        return JSON.stringify(puzzle);
    }

    drawLines(container) {
        for (let i = 4; i < this.width; i+= 5) {
            container.find('td[data-col=' + i + ']').css('border-right', '2px solid gray');
        }
        for (let i = 4; i < this.height; i+= 5) {
            container.find('td[data-row=' + i + ']').css('border-bottom', '2px solid gray');
        }
    }


}