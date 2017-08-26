import { Koma, Move, BoardHistory } from "../src";
import * as Chai from "chai";

const expect = Chai.expect;

describe('Move', () => {
    describe('#fromStr', () => {
        it("parses FaceDown move string", () => {
            let move = Move.fromStr("113", 0);
            expect(move.no).to.equal(0);
            expect(move.block).to.equal(Koma.shi);
            expect(move.attack).to.equal(Koma.bakko);
            expect(move.pass).to.equal(false);
            expect(move.faceDown).to.equal(true);
        });
        it("parses Match move string", () => {
            let move = Move.fromStr("235", 0);
            expect(move.no).to.equal(1);
            expect(move.block).to.equal(Koma.bakko);
            expect(move.attack).to.equal(Koma.kin);
            expect(move.pass).to.equal(false);
            expect(move.faceDown).to.equal(false);
        });
        it("parses Pass move string", () => {
            let move = Move.fromStr("3p", 1);
            expect(move.no).to.equal(2);
            expect(move.pass).to.equal(true);
        });
        it("parses Hidden move string", () => {
            let move = Move.fromStr("3x2", 2);
            expect(move.no).to.equal(2);
            expect(move.block).to.equal(Koma.hidden);
            expect(move.attack).to.equal(Koma.gon);
            expect(move.pass).to.equal(false);
            expect(move.faceDown).to.equal(true);
        });
    });

    describe('#toString', () => {
        it("describes FaceDown move to string", () => {
            let move = Move.ofFaceDown(0, Koma.kin, Koma.gin);
            expect(move.toString()).to.equal("1x4");
        });
        it("describes Match move to string", () => {
            let move = Move.ofMatch(3, Koma.bakko, Koma.hisha);
            expect(move.toString()).to.equal("437");
        });
        it("describes Pass move to string", () => {
            let move = Move.ofPass(2);
            expect(move.toString()).to.equal("3p");
        });
        it("describes Hidden-faceDown move to string", () => {
            let move = Move.ofFaceDown(0, Koma.hidden, Koma.gin);
            expect(move.toString()).to.equal("1x4");
        });
    });

    describe('#toOpenString', () => {
        it("describes FaceDown move to string", () => {
            let move = Move.ofFaceDown(0, Koma.kin, Koma.gin);
            expect(move.toOpenString()).to.equal("154");
        });
        it("describes Match move to string", () => {
            let move = Move.ofMatch(3, Koma.bakko, Koma.hisha);
            expect(move.toOpenString()).to.equal("437");
        });
        it("describes Pass move to string", () => {
            let move = Move.ofPass(2);
            expect(move.toOpenString()).to.equal("3p");
        });
        it("describes Hidden-faceDown move to string", () => {
            let move = Move.ofFaceDown(0, Koma.hidden, Koma.gin);
            expect(move.toOpenString()).to.equal("1x4");
        });
    });

    describe('#toScore', () => {
        it("match finnish", () => {
            expect(Move.ofFinish(0, Koma.shi, Koma.shi).toScore()).to.equal(10);
            expect(Move.ofFinish(0, Koma.gon, Koma.gon).toScore()).to.equal(20);
            expect(Move.ofFinish(0, Koma.bakko, Koma.bakko).toScore()).to.equal(20);
            expect(Move.ofFinish(0, Koma.gin, Koma.gin).toScore()).to.equal(30);
            expect(Move.ofFinish(0, Koma.kin, Koma.kin).toScore()).to.equal(30);
            expect(Move.ofFinish(0, Koma.kaku, Koma.kaku).toScore()).to.equal(40);
            expect(Move.ofFinish(0, Koma.hisha, Koma.hisha).toScore()).to.equal(40);
            expect(Move.ofFinish(0, Koma.ou, Koma.gyoku).toScore()).to.equal(50);
            expect(Move.ofFinish(0, Koma.gyoku, Koma.ou).toScore()).to.equal(50);
        });
        it("double up finnish", () => {
            expect(Move.ofDoubleUpFinish(0, Koma.shi, Koma.shi).toScore()).to.equal(20);
            expect(Move.ofDoubleUpFinish(0, Koma.gon, Koma.gon).toScore()).to.equal(40);
            expect(Move.ofDoubleUpFinish(0, Koma.bakko, Koma.bakko).toScore()).to.equal(40);
            expect(Move.ofDoubleUpFinish(0, Koma.gin, Koma.gin).toScore()).to.equal(60);
            expect(Move.ofDoubleUpFinish(0, Koma.kin, Koma.kin).toScore()).to.equal(60);
            expect(Move.ofDoubleUpFinish(0, Koma.kaku, Koma.kaku).toScore()).to.equal(80);
            expect(Move.ofDoubleUpFinish(0, Koma.hisha, Koma.hisha).toScore()).to.equal(80);
            expect(Move.ofDoubleUpFinish(0, Koma.ou, Koma.gyoku).toScore()).to.equal(100);
            expect(Move.ofDoubleUpFinish(0, Koma.gyoku, Koma.ou).toScore()).to.equal(100);
        });
    });
});

describe('BoardHistory', () => {
    let sampleHistory: BoardHistory;
    beforeEach(() => {
        let tegomas = new Array<string>("12345678", "12345679", "11112345", "11112345");
        sampleHistory = new BoardHistory(0, tegomas);
        sampleHistory.push(Move.ofFaceDown(0, Koma.shi, Koma.bakko));
        sampleHistory.push(Move.ofPass(1));
        sampleHistory.push(Move.ofPass(2));
        sampleHistory.push(Move.ofMatch(3, Koma.bakko, Koma.shi));
        sampleHistory.push(Move.ofPass(0));
        sampleHistory.push(Move.ofPass(1));
        sampleHistory.push(Move.ofMatch(2, Koma.shi, Koma.kin));
    });
    describe('#parseMoveHistory', () => {
        it("parse empty", () => {
            let array = [] as string[];
            let moves = BoardHistory.parseMoveHistory(array);
            expect(moves.length).to.equal(0);
        });
        it("parse moves", () => {
            let array = "113,2p,3p,431,1p,2p,315".split(",");
            let moves = BoardHistory.parseMoveHistory(array);
            expect(moves.length).to.equal(7);
            expect(moves[0].toOpenString()).to.equal("113");
            expect(moves[1].toOpenString()).to.equal("2p");
            expect(moves[2].toOpenString()).to.equal("3p");
            expect(moves[3].toOpenString()).to.equal("431");
        });
        it("parse moves containing hidden", () => {
            let array = "1x3,2p,3p,431,1p,2p,315".split(",");
            let moves = BoardHistory.parseMoveHistory(array);
            expect(moves.length).to.equal(7);
            expect(moves[0].toOpenString()).to.equal("1x3");
            expect(moves[1].toOpenString()).to.equal("2p");
            expect(moves[2].toOpenString()).to.equal("3p");
            expect(moves[3].toOpenString()).to.equal("431");
        });
    });

    describe('#toString', () => {
        it("describes history in string format", () => {
            expect(sampleHistory.toString()).to.equal("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315");
        });
        it("history does not contain 'x' (hidden)", () => {
            expect(sampleHistory.toString()).to.not.contain("x");
        });
    });

    describe('#toAllHiddenString', () => {
        it("describes hidden history to observers", () => {
            const h = BoardHistory.fromString("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,3p,412");
            expect(h.toAllHiddenString()).to.equal("3xxxxxxx,xxxxxxxx,xxxxxxxx,123xxxxx,s1,1x3,2p,3p,431,1p,2p,3p,4x2");
        });
    });

    describe('#toHiddenString', () => {
        it("describes hidden history #0", () => {
            const h = BoardHistory.fromString("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,3p,412");
            expect(h.toHiddenString(0)).to.equal("12345678,xxxxxxxx,xxxxxxxx,123xxxxx,s1,113,2p,3p,431,1p,2p,3p,4x2");
        });
        it("describes hidden history #1", () => {
            const h = BoardHistory.fromString("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,3p,412");
            expect(h.toHiddenString(1)).to.equal("3xxxxxxx,12345679,xxxxxxxx,123xxxxx,s1,1x3,2p,3p,431,1p,2p,3p,4x2");
        });
        it("describes hidden history #2", () => {
            const h = BoardHistory.fromString("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,3p,412");
            expect(h.toHiddenString(2)).to.equal("3xxxxxxx,xxxxxxxx,11112345,123xxxxx,s1,1x3,2p,3p,431,1p,2p,3p,4x2");
        });
        it("describes hidden history #3", () => {
            const h = BoardHistory.fromString("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,3p,412");
            expect(h.toHiddenString(3)).to.equal("3xxxxxxx,xxxxxxxx,xxxxxxxx,11112345,s1,1x3,2p,3p,431,1p,2p,3p,412");
        });
    });

    describe('#fromString', () => {
        it("sample to string and reconstruct BoardHistory Object", () => {
            let str = sampleHistory.toString();
            let history = BoardHistory.fromString(str);
            expect(history.toString()).to.equal(str);
        });
        it("from test history", () => {
            let history = BoardHistory.fromString("12345678,12345679,11112345,11112345,s1");
            expect(history.hands[0]).to.equal("12345678");
            expect(history.hands[1]).to.equal("12345679");
            expect(history.hands[2]).to.equal("11112345");
            expect(history.hands[3]).to.equal("11112345");
        });

        it("from finished board", () => {
            let history = BoardHistory.fromString("22221678,11113345,11145679,11345345,s1,112,2p,3p,4p,162,2p,3p,4p,172,2p,3p,4p,128");
            expect(history.moveStack.length).to.equal(13);
            expect(history.lastMove.finish).to.be.true;
        });
    });

    describe('#push', () => {
        it("adds a new move on history", () => {
            let preLength = sampleHistory.moveStack.length;
            sampleHistory.push(Move.ofPass(4));
            expect(sampleHistory.moveStack.length).to.equal(preLength + 1);
        });
    });
});
