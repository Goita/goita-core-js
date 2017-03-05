import { Move, Koma, Board } from '../src';
import * as Chai from "chai";
import { ThinkingInfo } from '../src/thinkinginfo';

const expect = Chai.expect;

describe('ThinkingInfo', () => {
    describe('#getPossibleMoves', () => {
        it("first turn", () => {
            //hand: 12345678 -> 1?(6), 2?(6), 3?(6), 4?(6), 5?(6), 6?(6), 7?(6), 8?(7) = 49
            const info = new ThinkingInfo(1, 1, "12345678", ["00000000", "00000000", "00000000", "00000000"], "00000000", null, [0, 0, 0, 0], "");
            let moves = info.getPossibleMoves();
            //moves.forEach(m=>console.log(m.toOpenString()));
            expect(moves.some(m => m.pass), "dealer cannot pass").to.equal(false);
            expect(moves.length).to.equal(49);
        });

        it("match turn", () => {
            //attack:3, hand: 12345679 -> pass(1), 3?(6), 9?:(7) = 14
            const info = new ThinkingInfo(3, 0, "12345679", ["x3000000", "00000000", "00000000", "00000000"], "00000000",
                Move.ofFaceDown(0, Koma.hidden, Koma.bakko), [0, 0, 0, 0], "1x3");
            let moves = info.getPossibleMoves();
            //moves.forEach(m=>console.log(m.toOpenString()));
            expect(moves.some(m => m.pass), "can pass").to.equal(true);
            expect(moves.length).to.equal(14);
        });

        it("finish move", () => {
            const h = "12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315,4p,156,267,3p,4p,174,242,3p,4p";
            const board = Board.createFromString(h);
            const info = board.toThinkingInfo();
            const moves = info.getPossibleMoves();
            //must contain pass & gon-ou finish move
            expect(moves.some(m => m.finish && m.attack === Koma.ou && m.block === Koma.gon)).to.be.true;
            expect(moves.some(m => m.pass)).to.be.true;
        });
        it("end of playing", () => {
            //attack:3, hand: 12345679 -> pass(1), 3?(6), 9?:(7) = 14
            const info = new ThinkingInfo(0, 0, "00000000", ["x6x6x7x4", "00000000", "00000000", "00000000"], "16267754",
                Move.ofFinish(0, Koma.hidden, Koma.gin), [0, 0, 0, 0], "1x6,2p,3p,4p,1x6,2p,3p,4p,1x7,2p,3p,4p,1x4");
            const moves = info.getPossibleMoves();
            expect(moves.length).to.equal(0);
        });

        it("88 or 99 moves are not allowed", () => {
            //"12667789,12345543,11112345,11112345,s1"
            //attack:0, hand: 12667789 -> must not contain 188 nor 199
            const info = new ThinkingInfo(0, 0, "12667789", ["00000000", "00000000", "00000000", "00000000"], "00000000", null, [0, 0, 0, 0], "");
            const moves = new Array<string>();
            for (const move of info.getPossibleMoves()) {
                moves.push(move.toOpenString());
            }
            expect(moves).to.not.contain("188");
            expect(moves).to.not.contain("199");
        });

        it("king's double up finish", () => {
            const h = "12667789,12345543,11112345,11112345,s1,116,2p,3p,4p,126,2p,3p,4p,177,2p,3p,4p";
            const board = Board.createFromString(h);
            const info = board.toThinkingInfo();
            const moves = new Array<string>();
            for (const move of info.getPossibleMoves()) {
                moves.push(move.toOpenString());
            }
            expect(moves).to.contain("189");
            expect(moves).to.contain("198");
        });
    });

    describe('#getBlockKomaList', () => {
        it('get block-list except pass', () => {
            //attack:3, hand: 12345679 -> pass(1), 3?(6), 9?:(7) = 14
            const info = new ThinkingInfo(3, 0, "12345679", ["x3000000", "00000000", "00000000", "00000000"], "00000000",
                Move.ofFaceDown(0, Koma.hidden, Koma.bakko), [0, 0, 0, 0], "1x3");
            const blocks = info.getBlockKomaList();
            expect(blocks).to.contain(Koma.bakko);
            expect(blocks).to.contain(Koma.gyoku);
            expect(blocks.length).to.equal(2);
        });
        it('get an empty block-list, only pass is available', () => {
            const info = new ThinkingInfo(1, 0, "12245677", ["x3000000", "00000000", "00000000", "00000000"], "00000000",
                Move.ofFaceDown(0, Koma.hidden, Koma.bakko), [0, 0, 0, 0], "1x3");
            const blocks = info.getBlockKomaList();
            expect(blocks.length).to.equal(0);
        });
    });

    describe('#getAttackKomaList', () => {
        it('get attack-list', () => {
            //attack:3, hand: 12345679 -> block:3 , attack: 1, 2, 4, 5, 6, 7
            const info = new ThinkingInfo(3, 0, "12345679", ["x3000000", "00000000", "00000000", "00000000"], "00000000",
                Move.ofFaceDown(0, Koma.hidden, Koma.bakko), [0, 0, 0, 0], "1x3");
            const attacks = info.getAttackKomaList(Koma.bakko);
            expect(attacks.length).to.equal(6);
        });
        it('throw error, invalid block koma is given', () => {
            const info = new ThinkingInfo(1, 0, "12345679", ["x3000000", "00000000", "00000000", "00000000"], "00000000",
                Move.ofFaceDown(0, Koma.hidden, Koma.bakko), [0, 0, 0, 0], "1x3");
            expect(ThinkingInfo.prototype.getAttackKomaList.bind(info, Koma.shi)).throws();
        });
    });

    describe('#canPass', () => {
        it('returns true', () => {
            const info = new ThinkingInfo(1, 0, "12345679", ["x3000000", "00000000", "00000000", "00000000"], "00000000",
                Move.ofFaceDown(0, Koma.hidden, Koma.bakko), [0, 0, 0, 0], "1x3");
            expect(info.canPass).to.be.true;
        });

        it('returns false', () => {
            const info = new ThinkingInfo(0, 0, "12345679", ["x3000000", "00000000", "00000000", "00000000"], "00000000",
                Move.ofFaceDown(0, Koma.hidden, Koma.bakko), [0, 0, 0, 0], "1x3,2p,3p,4p");
            expect(info.canPass).to.be.false;
        });
    });
});