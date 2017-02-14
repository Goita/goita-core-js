import {Move, Koma, Board, ThinkingInfo} from '../src';
import * as Chai from "chai";

const expect = Chai.expect;

describe('ThinkingInfo',()=>{
    describe('#getPossibleMoves', ()=>{
        it("first turn", ()=>{
            //hand: 12345678 -> 1?(6), 2?(6), 3?(6), 4?(6), 5?(6), 6?(6), 7?(6), 8?(7) = 49 
            let info = new ThinkingInfo(1, "12345678", ["00000000","00000000","00000000","00000000"], null);
            let moves = info.getPossibleMoves();
            //moves.forEach(m=>console.log(m.toOpenString()));
            expect(moves.some(m=>m.pass),"dealer cannot pass").to.equal(false);
            expect(moves.length).to.equal(49);
        });

        it("match turn", ()=>{
            //attack:3, hand: 12345679 -> pass(1), 3?(6), 9?:(7) = 14 
            let info = new ThinkingInfo(3, "12345679", ["x3000000","00000000","00000000","00000000"],
                                        Move.ofFaceDown(0, Koma.shi, Koma.bakko));
            let moves = info.getPossibleMoves();
            //moves.forEach(m=>console.log(m.toOpenString()));
            expect(moves.some(m=>m.pass), "can pass").to.equal(true);
            expect(moves.length).to.equal(14);
        });

        it("finish move", ()=>{
            const h = "12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315,4p,156,267,3p,4p,174,242,3p,4p";
            const board = Board.createFromString(h);
            const info = board.toThinkingInfo();
            const moves = info.getPossibleMoves();
            //must contain pass & gon-ou finish move
            expect(moves.some(m=>m.finish && m.attack === Koma.ou && m.block === Koma.gon)).to.be.true;
            expect(moves.some(m=>m.pass)).to.be.true;
        });
        it("end of playing", ()=>{
            //attack:3, hand: 12345679 -> pass(1), 3?(6), 9?:(7) = 14 
            let info = new ThinkingInfo(0, "00000000", ["x6x6x7x4","00000000","00000000","00000000"],
                                        Move.ofFinish(0, Koma.kin, Koma.gin));
            let moves = info.getPossibleMoves();
            expect(moves.length).to.equal(0);
        });

        it("88 or 99 moves are not allowed", ()=>{
            //"12667789,12345543,11112345,11112345,s1"
            //attack:0, hand: 12667789 -> must not contain 188 nor 199 
            const info = new ThinkingInfo(0, "12667789", ["00000000","00000000","00000000","00000000"], null);
            const moves = new Array<string>();
            for(const move of info.getPossibleMoves()){
                moves.push(move.toOpenString());
            }
            expect(moves).to.not.contain("188");
            expect(moves).to.not.contain("199");
        });

        it("king's double up finish", ()=>{
            const h = "12667789,12345543,11112345,11112345,s1,116,2p,3p,4p,126,2p,3p,4p,177,2p,3p,4p";
            const board = Board.createFromString(h);
            const info = board.toThinkingInfo();
            const moves = new Array<string>();
            for(const move of info.getPossibleMoves()){
                moves.push(move.toOpenString());
            }
            expect(moves).to.contain("189");
            expect(moves).to.contain("198");
        });
    });
});