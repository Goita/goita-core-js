/// <reference path="../typings/index.d.ts" />

import {Board, Koma, KomaArray} from '../src';
import * as Chai from "chai";

describe('Board',()=>{
    let testBoard: Board;
    beforeEach(()=>{
        testBoard = Board.createFromString("12345678,12345679,11112345,11112345,s1");
    });

    describe('#constructor', ()=>{
        it("create object", ()=>{
            let dealer = 2;
            let table = Board.createRandomly(dealer);
            Chai.expect(table.currentPlayer.no).to.equal(dealer);
            Chai.expect(table.history.lastAttacker).to.equal(dealer);
            Chai.expect(table.history.turn).to.equal(dealer);
            Chai.expect(table.history.moveStack.length).to.equal(0);
        });
    });

    describe('#play', ()=>{
        it("face down", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            Chai.expect(testBoard.currentPlayer.no, "next player's turn").to.equal(1);
            Chai.expect(testBoard.history.lastMove.faceDown,"first play must be a face down move").to.equal(true);
        });
        it("match", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.play(Koma.bakko, Koma.kaku);
            Chai.expect(testBoard.history.lastMove.faceDown).to.equal(false);
            Chai.expect(testBoard.history.lastMove.toOpenString()).to.equal("236");
        });
    });

    describe('#canPlay', ()=>{
        //dealer turn
        it("returns true with a right move on dealer turn", ()=>{
            Chai.expect(testBoard.canPlay(Koma.shi, Koma.bakko)).to.equal(true);
        });
        it("doesn't have 2 shi on dealer turn", ()=>{
            Chai.expect(testBoard.canPlay(Koma.shi, Koma.shi)).to.equal(false);
        });
        //after the dealer's attack
        it("can match", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            Chai.expect(testBoard.canPlay(Koma.bakko, Koma.kaku)).to.equal(true);
        });
        it("cannot match with wrong koma", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            Chai.expect(testBoard.canPlay(Koma.shi, Koma.kaku)).to.equal(false);
        });
        it("cannot match with a koma not in hand", ()=>{
            testBoard.play(Koma.shi, Koma.kaku);
            testBoard.pass();
            //hand: 11112345
            Chai.expect(testBoard.canPlay(Koma.kaku, Koma.shi)).to.equal(false);
        });
        it("returns false because same 2 koma not in hand", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            Chai.expect(testBoard.canPlay(Koma.kaku, Koma.kaku)).to.equal(false);
        });
        //2nd attack after 3pass
        it("returns true with a correct 2nd attack", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.pass();
            testBoard.pass();
            testBoard.pass();
            //hand: 02045678
            Chai.expect(testBoard.canPlay(Koma.gin, Koma.kaku)).to.equal(true);
        });
        it("returns false with a wrong 2nd attack", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.pass();
            testBoard.pass();
            testBoard.pass();
            //hand: 02045678
            Chai.expect(testBoard.canPlay(Koma.shi, Koma.bakko)).to.equal(false);
        });
        //using the king
        it("cannot attack with the ou on the dealer turn", ()=>{
            Chai.expect(testBoard.canPlay(Koma.shi, Koma.ou)).to.equal(false);
        });
        it("returns true with the ou attack after gyoku used", ()=>{
            testBoard.play(Koma.shi, Koma.kaku);
            testBoard.play(Koma.gyoku, Koma.bakko);
            testBoard.pass();
            testBoard.pass();
            Chai.expect(testBoard.canPlay(Koma.bakko, Koma.ou)).to.equal(true);
        });
        it("can attack with the ou on the double king hand", ()=>{
            let ddBoard = Board.createFromString("23456789,11234567,11112345,11112345,s1");
            Chai.expect(ddBoard.canPlay(Koma.bakko, Koma.ou)).to.equal(true);
        });
    });

    describe('#pass', ()=>{
        it("pass", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.pass();
            Chai.expect(testBoard.history.lastMove.pass).to.equal(true);
            Chai.expect(testBoard.history.turn).to.equal(2);
        });
    });

    describe('#canPass', ()=>{
        it("returns false on dealer turn", ()=>{
            Chai.expect(testBoard.canPass()).to.equal(false);
        });
        it("returns true on 2nd turn", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            Chai.expect(testBoard.canPass()).to.equal(true);
        });
        it("returns false after 3pass", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.pass();
            testBoard.pass();
            testBoard.pass();
            Chai.expect(testBoard.canPass()).to.equal(false);
        });
    });

    describe('#getPossibleMoves', ()=>{
        it("first turn", ()=>{
            //hand: 12345678 -> 1?(6), 2?(6), 3?(6), 4?(6), 5?(6), 6?(6), 7?(6), 8?(7) = 49 
            let moves = testBoard.getPossibleMoves();
            //moves.forEach(m=>console.log(m.toOpenString()));
            Chai.expect(moves.some(m=>m.pass),"dealer cannot pass").to.equal(false);
            Chai.expect(moves.length).to.equal(49);
            Chai.expect(moves.every(m=>testBoard.canPlayMove(m))).to.be.true;
        });
        it("match turn", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            //attack:3, hand: 12345679 -> pass(1), 3?(6), 9?:(7) = 14 
            let moves = testBoard.getPossibleMoves();
            //moves.forEach(m=>console.log(m.toOpenString()));
            Chai.expect(moves.some(m=>m.pass), "can pass").to.equal(true);
            Chai.expect(moves.length).to.equal(14);
            Chai.expect(moves.every(m=>testBoard.canPlayMove(m))).to.be.true;
        });
    });

    describe('#undo', ()=>{
        it("rollbacks history", ()=>{
            let initialState = testBoard.toHistoryString();
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.undo();
            let rollbackedState = testBoard.toHistoryString();
            Chai.expect(initialState).to.equal(rollbackedState);
        });
    });

    describe('#canUndo', ()=>{
        it("returns true a move stacked on history", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            Chai.expect(testBoard.canUndo()).to.equal(true);
        });
        it("returns false no move stacked on history", ()=>{
            Chai.expect(testBoard.canUndo()).to.equal(false);
        });
    });

    describe('#redo', ()=>{
        it("resumes a rollback", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            let initialState = testBoard.toHistoryString();
            testBoard.undo();
            testBoard.redo();
            let resumedState = testBoard.toHistoryString();
            Chai.expect(initialState).to.equal(resumedState);
        });
    });

    describe('#canRedo', ()=>{
        it("returns true after 'undo'", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.undo();
            Chai.expect(testBoard.canRedo()).to.equal(true);
        });
        it("returns false before 'undo'", ()=>{
            testBoard.play(Koma.shi, Koma.bakko);
            Chai.expect(testBoard.canRedo()).to.equal(false);
        });
    });

    describe('#createFromString', ()=>{
        it("testBoard", ()=>{
            let board = Board.createFromString("12345678,12345679,11112345,11112345,s1");
            Chai.expect(board.currentPlayer.no).to.equal(0);
            Chai.expect(board.history.moveStack.length).to.equal(0);
            Chai.expect(KomaArray.toString(board.players[0].hand)).to.equal("12345678");
            Chai.expect(KomaArray.toString(board.players[1].hand)).to.equal("12345679");
            Chai.expect(KomaArray.toString(board.players[2].hand)).to.equal("11112345");
            Chai.expect(KomaArray.toString(board.players[3].hand)).to.equal("11112345");
        });
    });
});