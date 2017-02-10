import {Move, Koma, ThinkingInfo} from '../src';
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
        it("end of playing", ()=>{
            //attack:3, hand: 12345679 -> pass(1), 3?(6), 9?:(7) = 14 
            let info = new ThinkingInfo(0, "00000000", ["x6x6x7x4","00000000","00000000","00000000"],
                                        Move.ofFinish(0, Koma.kin, Koma.gin));
            let moves = info.getPossibleMoves();
            expect(moves.length).to.equal(0);
        });
    });
});