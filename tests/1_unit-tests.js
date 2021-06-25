const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const validPuzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const solvedPuzzle = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

suite('UnitTests', () => {
    
    suite('solver tests', function () {

        test('Logic handles a valid puzzle string of 81 characters', function(done) {
            assert.equal(solver.solve(validPuzzle), solvedPuzzle);
            done();
        });

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
            const invalidPuzzle = '53..7.A..6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
            assert.equal(solver.solve(invalidPuzzle), false);
            done();
        });

        test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
            const invalidPuzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79123'; 
            assert.equal(solver.solve(invalidPuzzle), false);
            done();
        });

        test('Logic handles a valid row placement', function(done) {
            assert.equal(solver.checkRowPlacement(validPuzzle, 'A', '3', '4'), true);
            done();
        });

        test('Logic handles an invalid row placement', function(done) {
            assert.equal(solver.checkRowPlacement(validPuzzle, 'A', '4', '5'), false);
            done();
        });

        test('Logic handles a valid column placement', function(done) {
            assert.equal(solver.checkColPlacement(validPuzzle, 'B', '7', '3'), true);
            done();
        });

        test('Logic handles an invalid column placement', function(done) {
            assert.equal(solver.checkColPlacement(validPuzzle, 'B', '8', '6'), false);
            done();
        });

        test('Logic handles a valid region (3x3 grid) placement', function(done) {
            assert.equal(solver.checkRegionPlacement(validPuzzle, 'C', '5', '4'), true);
            done();
        });

        test('Logic handles an invalid region (3x3 grid) placement', function(done) {
            assert.equal(solver.checkRegionPlacement(validPuzzle, 'C', '9', '6'), false);
            done();
        });

        test('Valid puzzle strings pass the solver', function(done) {
            assert.equal(solver.solve(validPuzzle), solvedPuzzle);
            done();
        });

        test('Invalid puzzle strings fail the solver', function(done) {
            const invalidPuzzle = '55..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
            assert.equal(solver.solve(invalidPuzzle), false);
            done();
        });

        test('Solver returns the the expected solution for an incomplete puzzle', function(done) {
            assert.equal(solver.solve(validPuzzle), solvedPuzzle);
            done();
        });
    });
});