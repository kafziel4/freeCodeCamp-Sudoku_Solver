class SudokuSolver {

  validate(puzzleString, row, column, value) {
    let grid = this.transformToGrid(puzzleString);
    row = this.convertLetterToNumber(row);
    if(grid[row - 1][column - 1] == value) {
      return true;
    }
  }

  convertLetterToNumber(row) {
    switch(row.toUpperCase()) {
      case 'A':
        return 1;
      case 'B':
        return 2;
      case 'C':
        return 3;
      case 'D':
        return 4;
      case 'E':
        return 5;
      case 'F':
        return 6;
      case 'G':
        return 7;
      case 'H':
        return 8;
      case 'I':
        return 9;
      default:
        return false;
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transformToGrid(puzzleString);
    row = this.convertLetterToNumber(row);
    if(grid[row - 1][column - 1] !== 0) {
      return false;
    }

    for(let i = 0; i < 9; i++) {
      if(grid[row - 1][i] == value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.transformToGrid(puzzleString);
    row = this.convertLetterToNumber(row);
    if(grid[row - 1][column - 1] !==0) {
      return false;
    }

    for(let i = 0; i < 9; i++) {
      if(grid[i][column - 1] == value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.transformToGrid(puzzleString);
    row = this.convertLetterToNumber(row);
    if(grid[row - 1][column - 1] !==0) {
      return false;
    }

    let startRow = row
    let startCol = column

    switch(row % 3) {
      case 0:
        startRow = row - 3;
        break;
      case 1:
        startRow = row - 1;
        break;
      case 2:
        startRow = row - 2;
        break;
    }

    switch(column % 3) {
      case 0:
        startCol = column - 3;
        break;
      case 1:
        startCol = column - 1;
        break;
      case 2:
        startCol = column - 2;
        break;
    }

    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if(grid[i + startRow][j + startCol] == value) {
          return false;
        }
      }
    }
    
    return true;
  }

  solveSudoku(grid, row, col) {
    if (row === 9 - 1 && col === 9) {
      return grid;
    }

    if (col === 9) {
      row++;
      col = 0;
    }

    if(grid[row][col] !== 0) {
      return this.solveSudoku(grid, row, col + 1);
    }

    for(let num = 1; num < 10; num++) {
      if(this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if(this.solveSudoku(grid, row, col + 1)) {
          return grid;
        }
      }

      grid[row][col] = 0;
    }

    return false;
  }

  isSafe(grid, row, col, num) {
    for(let x =0; x <= 8; x++) {
      if(grid[row][x] === num) {
        return false;
      }
    }

    for(let x = 0; x <= 8; x++) {
      if(grid[x][col] === num) {
        return false;
      }
    }

    let startRow = row - (row % 3);
    let startCol = col - (col % 3);

    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if(grid[i + startRow][j + startCol] === num) {
          return false;
        }
      }
    }
    
    return true;
  }

  transformToGrid(puzzleString) {
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    let row = -1;
    let col = 0;

    for(let i = 0; i < puzzleString.length; i++) {
      if(i % 9 === 0) {
        row++
      }
      if(col % 9 === 0) {
        col = 0;
      }

      grid[row][col] = puzzleString[i] === '.' ? 0 : +puzzleString[i];
      col++;
    }

    return grid;
  }
  
  transformToString(grid) {
    return grid.flat().join('');
  }

  solve(puzzleString) {
    const regexPuzzle = /[^0-9.]/g;
    
    if(puzzleString.length != 81) {
      return false;
    }

    if(puzzleString.match(regexPuzzle)) {
      return false;
    }
    
    let grid = this.transformToGrid(puzzleString);
    let solvedSudoku = this.solveSudoku(grid, 0, 0);
    
    if(!solvedSudoku) {
      return false;
    }

    let solutionString = this.transformToString(solvedSudoku);
    return solutionString;
  }
}

module.exports = SudokuSolver;