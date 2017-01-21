import {Factory, Define} from "../src";
import * as Chai from "chai";

const expect = Chai.expect;

describe('Factory',()=>{
    describe('#createGame', ()=>{
        it("return game object", ()=>{
            let game = Factory.createGame();
            expect(game.winScore).to.equal(Define.defaultWinScore);
        });
    });

    describe('#createBoard', ()=>{
        it("return board object", ()=>{
            let board = Factory.createBoard();
            expect(board.turnPlayer.no).to.equal(0);
        });
    });
});