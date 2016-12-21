/// <reference path="../typings/index.d.ts" />

import {Koma, Move, TableHistory} from "../src";
import * as Chai from "chai";

describe('Move',()=>{

    beforeEach(()=>{
    });

    describe('#fromStr', ()=>{
        it("parses FaceDown move string", ()=>{
            let move1 = Move.fromStr("113", 1);
            Chai.expect(move1.no).to.equals(1);
            Chai.expect(move1.block).to.equals(Koma.shi);
            Chai.expect(move1.attack).to.equals(Koma.bakko);
            Chai.expect(move1.pass).to.equals(false);
            Chai.expect(move1.faceDown).to.equals(true);
        });
        it("parses Match move string", ()=>{
            let move1 = Move.fromStr("235", 1);
            Chai.expect(move1.no).to.equals(2);
            Chai.expect(move1.block).to.equals(Koma.bakko);
            Chai.expect(move1.attack).to.equals(Koma.kin);
            Chai.expect(move1.pass).to.equals(false);
            Chai.expect(move1.faceDown).to.equals(false);
        });
        it("parses Pass move string", ()=>{
            let move1 = Move.fromStr("3p", 2);
            Chai.expect(move1.no).to.equals(3);
            Chai.expect(move1.pass).to.equals(true);
        });
    });

    describe('#toString', ()=>{
        it("describes FaceDown move to string", ()=>{
            let move1 = Move.ofFaceDown(1,Koma.kin, Koma.gin);
            Chai.expect(move1.toString()).to.equals("1x4");
        });
        it("describes Match move to string", ()=>{
            let move1 = Move.ofMatch(4,Koma.bakko, Koma.hisha);
            Chai.expect(move1.toString()).to.equals("437");
        });
        it("describes Pass move to string", ()=>{
            let move1 = Move.ofPass(3);
            Chai.expect(move1.toString()).to.equals("3p");
        });
    });

    describe('#toOpenString', ()=>{
        it("describes FaceDown move to string", ()=>{
            let move1 = Move.ofFaceDown(1,Koma.kin, Koma.gin);
            Chai.expect(move1.toOpenString()).to.equals("154");
        });
        it("describes Match move to string", ()=>{
            let move1 = Move.ofMatch(4,Koma.bakko, Koma.hisha);
            Chai.expect(move1.toOpenString()).to.equals("437");
        });
        it("describes Pass move to string", ()=>{
            let move1 = Move.ofPass(3);
            Chai.expect(move1.toOpenString()).to.equals("3p");
        });
    });
});

describe('TableHistory',()=>{
    let sampleHistory: TableHistory;
    beforeEach(()=>{
        let tegomas = new Array<string>("12345678","12345679","11112345","11112345");
        sampleHistory = new TableHistory(1, tegomas);
        sampleHistory.push(Move.ofFaceDown(1, Koma.shi, Koma.bakko));
        sampleHistory.push(Move.ofPass(2));
        sampleHistory.push(Move.ofPass(3));
        sampleHistory.push(Move.ofMatch(4, Koma.bakko, Koma.shi));
        sampleHistory.push(Move.ofPass(1));
        sampleHistory.push(Move.ofPass(2));
        sampleHistory.push(Move.ofMatch(3, Koma.shi, Koma.kin));
    });
    describe('#parseMoveHistory',()=>{
        it("parse moves", ()=>{
            let array = "113,2p,3p,431,1p,2p,315".split(",");
            let moves = TableHistory.parseMoveHistory(array);
            Chai.expect(moves.length).to.equal(7);
            Chai.expect(moves[0].toOpenString()).to.equal("113");
            Chai.expect(moves[1].toOpenString()).to.equal("2p");
            Chai.expect(moves[2].toOpenString()).to.equal("3p");
            Chai.expect(moves[3].toOpenString()).to.equal("431");
        });
    });

    describe('#toString',()=>{
        it("describes history in string format", ()=>{
            Chai.expect(sampleHistory.toString()).to.equal("12345678,12345679,11112345,11112345,113,2p,3p,431,1p,2p,315");
        });
    });

    describe('#fromString',()=>{
        it("parse historyString to TableHistory Object", ()=>{
            let str = sampleHistory.toString();
            let history = TableHistory.fromString(str);
            Chai.expect(history.toString()).to.equal(str);
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