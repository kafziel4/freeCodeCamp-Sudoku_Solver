const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const validPuzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const solvedPuzzle = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

suite('Functional Tests', () => {

    suite('POST /api/solve => puzzle', function() {


        test('Solve a puzzle with valid puzzle string', function(done) {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: validPuzzle
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, solvedPuzzle);
                    done();
                });
        });

        test('Solve a puzzle with missing puzzle string', function(done) {
            chai.request(server)
                .post('/api/solve')
                .send({
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });

        test('Solve a puzzle with invalid characters', function(done) {
            const invalidPuzzle = '53..7.A..6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: invalidPuzzle
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Solve a puzzle with incorrect length', function(done) {
            const invalidPuzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79123'; 

            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: invalidPuzzle
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved', function(done) {
            const invalidPuzzle = '55..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'

            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: invalidPuzzle
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });

    suite('POST /api/check => coordinate and value', function() {


        test('Check a puzzle placement with all fields', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A3',
                    value: '4'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, true);
                    done();
                });
        });

        test('Check a puzzle placement with single placement conflict', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'B7',
                    value: '5'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, false);
                    assert.equal(res.body.conflict.length, 1)
                    done();
                });
        });

        test('Check a puzzle placement with multiple placement conflicts', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'B9',
                    value: '1'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, false);
                    assert.equal(res.body.conflict.length, 2)
                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'C6',
                    value: '9'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, false);
                    assert.equal(res.body.conflict.length, 3)
                    done();
                });
        });

        test('Check a puzzle placement with missing required fields', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    coordinate: 'A3',
                    value: '4'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        test('Check a puzzle placement with invalid characters', function(done) {
            const invalidPuzzle = '53..7.A..6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: invalidPuzzle,
                    coordinate: 'A3',
                    value: '4'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        test('Check a puzzle placement with incorrect length', function(done) {
            const invalidPuzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79123'; 

            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: invalidPuzzle,
                    coordinate: 'A3',
                    value: '4'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'K9',
                    value: '4'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement value', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A3',
                    value: '0'
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
    });
});