'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  const regexPuzzle = /[^0-9.]/g;

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      const regexLetter = /[a-i]/i;
      const regexNumber = /[1-9]/i;

      if(!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const row = coordinate.split('')[0];
      const col = coordinate.split('')[1];

      if(
          coordinate.length !== 2 ||
          !row.match(regexLetter) ||
          !col.match(regexNumber)
        ) {
          return res.json({ error: 'Invalid coordinate' });
        }

      if(!value.match(regexNumber)) {
        return res.json({ error: 'Invalid value' });
      }

      if(puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if(puzzle.match(regexPuzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      let validate = solver.validate(puzzle, row, col, value)
      let validRow = solver.checkRowPlacement(puzzle, row, col, value);
      let validCol = solver.checkColPlacement(puzzle, row, col, value);
      let validRegion = solver.checkRegionPlacement(puzzle, row, col, value);
      let conflicts = [];

      if(validate) {
        return res.json({ valid: true });
      }

      if(validCol && validRow && validRegion) {
        return res.json({ valid: true });
      }
      else {
        if(!validRow) {
          conflicts.push('row');
        }
        if(!validCol) {
          conflicts.push('column');
        }
        if(!validRegion) {
          conflicts.push('region');
        }

        return res.json({ valid: false, conflict: conflicts });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;

      if(!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      if(puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if(puzzle.match(regexPuzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      let solution = solver.solve(puzzle);
      
      if(!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      return res.json({ solution: solution });
    });
};