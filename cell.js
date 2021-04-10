class Puzzle {
    constructor() {
        this.title = '';
        this.cells = [];
        this.rowNumbers = [];
        this.maxRowNumbers;
        this.colNumbers = [];
		this.snapshots = [];
        this.maxColNumbers;
        this.currentMouseCol = -1;
        this.currentMouseRow = -1;
        this.currentPaintCol = null;
        this.currentPaintRow = null;
        this.currentPaintDirection = null;
        this.currentPaintColour = null;
    }

    import(title, puzzleText) {
        this.title = title;

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

    setSize(colNumbers, rowNumbers) {
        this.width = colNumbers.length;
        this.height = rowNumbers.length;
        this.setColNumbers(colNumbers);
        this.setRowNumbers(rowNumbers);

        this.cells = [];
        for (let row = 0; row < this.height; row++) {
            this.cells[row] = '0'.repeat(this.width);
        }
    }

    setColNumbers(colNumbers) {
        this.colNumbers = colNumbers;
        this.maxColNumbers = 0;
        for (const col of colNumbers) {
            if (col.length > this.maxColNumbers) {
                this.maxColNumbers = col.length;
            }
        }
    }

    setRowNumbers(rowNumbers) {
        this.rowNumbers = rowNumbers;

        this.maxRowNumbers = 0;
        for (const row of rowNumbers) {
            if (row.length > this.maxRowNumbers) {
                this.maxRowNumbers = row.length;
            }
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
            const row = this.cells[idx].split('');
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
                const cellClass = "colour-" + cell;
                result += '<td class="' + cellClass + '" '
					+ 'data-row="' + (parseInt(idx) + parseInt(this.maxColNumbers)) + '" '
					+ 'data-col="' + (parseInt(col) + parseInt(this.maxRowNumbers)) + '">&nbsp;</td>';
            }
            result += "</tr>\n";
        }
        result += '</table>';

        return result;
    }


    getCell(row, col) {
        return this.cells[row - this.maxColNumbers].charAt(col - this.maxRowNumbers);
    }

    getCellFromMouseClick(node) {
        const row = node.data('row');
        const col = node.data('col');

        return this.getCell(row, col);
    }
	
	/**
	 * Handle the mouse button being pushed down (not necessarily coming up
	 *
	 */
    leftMouseDown(node) {
        const cellColour = this.getCellFromMouseClick(node);
		const newCellColour = (cellColour == '0') ? '1' : '0';
		
        this.currentMouseCol = node.data('col');
        this.currentMouseRow = node.data('row');
        
		const row = this.cells[this.currentMouseRow].split('');
		row[this.currentMouseCol] = newCellColour;
		this.cells[this.currentMouseRow] = row.join('');
        this.currentPaintColour = newCellColour;
		return newCellColour;
    }

	/**
	 * Handle a mouse movement
	 * (should move to the UI level)
	 */
    mouseMove(node) {
        const mouseRow = node.data('row');
        const mouseCol = node.data('col');

		// If we are painting, then we may have to do something, otherwise not
        if (this.currentPaintColour) {
            const dx = mouseCol != this.currentMouseCol;
            const dy = mouseRow != this.currentMouseRow;

			// If a paint direction isn't set, then set one. This ensures that when you are painting a row or column,
			// you can only continue to paint in that row or column
            if (!this.currentPaintDirection) {
                if (dx) {
                    this.currentPaintDirection = 'h';
                    this.currentPaintRow = mouseRow;
                } else if (dy) {
                    this.currentPaintDirection = 'v';
                    this.currentPaintCol = mouseCol;
                }
            }

			// We are painting, and are moving in the correct direction (horizontal or vertical) to allow painting
            if ((this.currentPaintDirection == 'h' && this.currentPaintRow == mouseRow && dx)
              || (this.currentPaintDirection == 'v' && this.currentPaintCol == mouseCol && dy)) {
                // We have moved to a new cell in the current Row or Col
				const row = this.cells[mouseRow].split('');
				row[mouseCol] = this.currentPaintColour;
				this.cells[this.mouseRow] = row.join('');
            }
        }
        this.currentMouseRow = mouseRow;
        this.currentMouseCol = mouseCol;
		return this.currentPaintColour;
    }

	/**
	 * Handle a mouse button being returned to the "up" position
	 * (should move to the UI level)
	 */
    mouseUp(node) {
        this.currentPaintColour = null;
        this.currentPaintDirection = null;
        this.currentPaintCol = null;
        this.currentPaintRow = null;
    }

	/**
	 * Fill the members of this object from a string (or from an array that has already been serialized)
	 *
	 */
    unserialize(puzzleVariables) {
        this.title = puzzleVariables.title;
        this.rowNumbers = puzzleVariables.rowNumbers;
		this.maxRowNumbers = puzzleVariables.maxRowNumbers;
        this.height = puzzleVariables.rowNumbers.length;
        this.colNumbers = puzzleVariables.colNumbers;
		this.maxColNumbers = puzzleVariables.maxColNumbers;
        this.width = puzzleVariables.colNumbers.length;
        this.cells = puzzleVariables.cells;
    }

	/**
	 * Convert this object into a string
	 *
	 */
    serialize() {
        const puzzle = {
            title : this.title,
            width : this.width,
            height : this.height,
            rowNumbers : this.rowNumbers,
			maxRowNumbers : this.maxRowNumbers,
            colNumbers : this.colNumbers,
			maxColNumbers : this.maxColNumbers
        };
		
		puzzle.cells = this.getCellColours();

        return JSON.stringify(puzzle);
    }
	
	/**
	 * Get all the cell colours for this puzzle
	 * (each row is a string, like "1100000010010010")
	 
	 */
	getCellColours() {
		return this.cells;
	}
	
	/**
	 * Given a set of cell colours, copy them into the cells of this Puzzle
	 *
	 */
	setCellColours(cells) {
		this.cells = cells;
	}

	/**
	 * Add gray lines every 5 cells
	 * (this should be moved to the interface level)
	 *
	 */
    drawLines(container) {
        for (let i = 4; i < this.width; i+= 5) {
            container.find('td[data-col=' + i + ']').css('border-right', '2px solid gray');
        }
        for (let i = 4; i < this.height; i+= 5) {
            container.find('td[data-row=' + i + ']').css('border-bottom', '2px solid gray');
        }
    }
	
	/**
	 * Get the current state of this Puzzle's cells and add them to the snapshots array
	 *
	 */
	takeSnapshot() {
		const snapshotDate = new Date();
		this.snapshots.push({
			title : snapshotDate.toLocaleString(),
			cells : this.getCellColours()
		});
	}
	
	/**
	 * Delete a snapshot from this Puzzle's list of snapshots
	 *
	 */
	deleteSnapshot(idx) {
		delete(this.snapshots[idx]);
	}


}