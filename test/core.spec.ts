/// <reference path="../typings/index.d.ts" />

import {GoitaCore, Define} from "../src";
import * as Chai from "chai";

describe('Core',()=>{
    describe('#createGame', ()=>{
        it("return game object", ()=>{
            let game = GoitaCore.createGame();
            Chai.expect(game.winScore).to.equal(Define.defaultWinScore);
        });
    });

    describe('#createBoard', ()=>{
        it("return board object", ()=>{
            let board = GoitaCore.createBoard();
            Chai.expect(board.turnPlayer.no).to.equal(0);
        });
    });
});