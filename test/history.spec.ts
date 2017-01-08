/// <reference path="../typings/index.d.ts" />

import {Koma, Move, BoardHistory} from "../src";
import * as Chai from "chai";

describe('Move',()=>{

    beforeEach(()=>{
    });

    describe('#fromStr', ()=>{
        it("parses FaceDown move string", ()=>{
            let move1 = Move.fromStr("113", 0);
            Chai.expect(move1.no).to.equal(0);
            Chai.expect(move1.block).to.equal(Koma.shi);
            Chai.expect(move1.attack).to.equal(Koma.bakko);
            Chai.expect(move1.pass).to.equal(false);
            Chai.expect(move1.faceDown).to.equal(true);
        });
        it("parses Match move string", ()=>{
            let move1 = Move.fromStr("235", 0);
            Chai.expect(move1.no).to.equal(1);
            Chai.expect(move1.block).to.equal(Koma.bakko);
            Chai.expect(move1.attack).to.equal(Koma.kin);
            Chai.expect(move1.pass).to.equal(false);
            Chai.expect(move1.faceDown).to.equal(false);
        });
        it("parses Pass move string", ()=>{
            let move1 = Move.fromStr("3p", 1);
            Chai.expect(move1.no).to.equal(2);
            Chai.expect(move1.pass).to.equal(true);
        });
    });

    describe('#toString', ()=>{
        it("describes FaceDown move to string", ()=>{
            let move1 = Move.ofFaceDown(0,Koma.kin, Koma.gin);
            Chai.expect(move1.toString()).to.equal("1x4");
        });
        it("describes Match move to string", ()=>{
            let move1 = Move.ofMatch(3,Koma.bakko, Koma.hisha);
            Chai.expect(move1.toString()).to.equal("437");
        });
        it("describes Pass move to string", ()=>{
            let move1 = Move.ofPass(2);
            Chai.expect(move1.toString()).to.equal("3p");
        });
    });

    describe('#toOpenString', ()=>{
        it("describes FaceDown move to string", ()=>{
            let move1 = Move.ofFaceDown(0,Koma.kin, Koma.gin);
            Chai.expect(move1.toOpenString()).to.equal("154");
        });
        it("describes Match move to string", ()=>{
            let move1 = Move.ofMatch(3,Koma.bakko, Koma.hisha);
            Chai.expect(move1.toOpenString()).to.equal("437");
        });
        it("describes Pass move to string", ()=>{
            let move1 = Move.ofPass(2);
            Chai.expect(move1.toOpenString()).to.equal("3p");
        });
    });
});

describe('BoardHistory',()=>{
    let sampleHistory: BoardHistory;
    beforeEach(()=>{
        let tegomas = new Array<string>("12345678","12345679","11112345","11112345");
        sampleHistory = new BoardHistory(0, tegomas);
        sampleHistory.push(Move.ofFaceDown(0, Koma.shi, Koma.bakko));
        sampleHistory.push(Move.ofPass(1));
        sampleHistory.push(Move.ofPass(2));
        sampleHistory.push(Move.ofMatch(3, Koma.bakko, Koma.shi));
        sampleHistory.push(Move.ofPass(0));
        sampleHistory.push(Move.ofPass(1));
        sampleHistory.push(Move.ofMatch(2, Koma.shi, Koma.kin));
    });
    describe('#parseMoveHistory',()=>{
        it("parse moves", ()=>{
            let array = "113,2p,3p,431,1p,2p,315".split(",");
            let moves = BoardHistory.parseMoveHistory(array);
            Chai.expect(moves.length).to.equal(7);
            Chai.expect(moves[0].toOpenString()).to.equal("113");
            Chai.expect(moves[1].toOpenString()).to.equal("2p");
            Chai.expect(moves[2].toOpenString()).to.equal("3p");
            Chai.expect(moves[3].toOpenString()).to.equal("431");
        });
    });

    describe('#toString',()=>{
        it("describes history in string format", ()=>{
            Chai.expect(sampleHistory.toString()).to.equal("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315");
        });
    });

    describe('#fromString',()=>{
        it("sample to string and reconstruct BoardHistory Object", ()=>{
            let str = sampleHistory.toString();
            let history = BoardHistory.fromString(str);
            Chai.expect(history.toString()).to.equal(str);
        });
        it("from test history",()=>{
            let history = BoardHistory.fromString("12345678,12345679,11112345,11112345,s1");
            Chai.expect(history.tegomas[0]).to.equal("12345678");
            Chai.expect(history.tegomas[1]).to.equal("12345679");
            Chai.expect(history.tegomas[2]).to.equal("11112345");
            Chai.expect(history.tegomas[3]).to.equal("11112345");
        });
    });

    describe('#push',()=>{
        it("adds a new move on history", ()=>{
            let preLength = sampleHistory.moveStack.length;
            sampleHistory.push(Move.ofPass(4));
            Chai.expect(sampleHistory.moveStack.length).to.equal(preLength + 1);
        });
    });
});