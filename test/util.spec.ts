import {Define, Util} from '../src';
import * as Chai from "chai";

const expect = Chai.expect;

describe('Util',()=>{
    let komaCircle: Array<string>;
    beforeEach(()=>{
        komaCircle = Define.komaCircle.split("");
    });

    describe('#cut', ()=>{
        it("should devide 32 elements array by 8 into 4 arrays", ()=>{
            let ret = Util.cut(komaCircle, 8);
            expect(ret.length).to.equals(4);
        });

        it("should devide komaCircle by 8 into 4 arrays and the results are correct", ()=>{
            let ret = Util.cut(komaCircle, 8);
            expect(ret[0].join("")).to.equals("11111111");
            expect(ret[1].join("")).to.equals("11222233");
            expect(ret[2].join("")).to.equals("33444455");
            expect(ret[3].join("")).to.equals("55667789");
        });
    });
    describe("#shuffle", ()=>{
        it("should shuffle an array then Shuffled Indicator will be in the range(14.5-16.5)", ()=>{
            let sumIndex = 0;
            let loop = 1000;
            for(let i=0;i<loop;i++){
                Util.shuffle(komaCircle);
                sumIndex += komaCircle.indexOf(Define.ou);
            }
            console.log("shuffled indicator: " + sumIndex/loop);
            expect(sumIndex/loop).to.within(14.5, 16.5);
            // 31/2 = 15.5
        });
    });

    describe('#dealTegomas', ()=>{
        it("get array of string", ()=>{
            let ret = Util.dealTegomas();
            expect(ret.length).to.equal(Define.maxPlayers);
            expect(ret[0].length).to.equal(Define.maxFieldLength);
            expect(ret[1].length).to.equal(Define.maxFieldLength);
            expect(ret[2].length).to.equal(Define.maxFieldLength);
            expect(ret[3].length).to.equal(Define.maxFieldLength);
        });
    });

    describe('#getNextTurn', ()=>{
        it("0->1, 1->2, 2->3, 3->0", ()=>{
            expect(Util.getNextTurn(0)).to.equal(1);
            expect(Util.getNextTurn(1)).to.equal(2);
            expect(Util.getNextTurn(2)).to.equal(3);
            expect(Util.getNextTurn(3)).to.equal(0);
        });
    });

    describe('#getPreviousTurn', ()=>{
        it("0->3, 1->0, 2->1, 3->2", ()=>{
            expect(Util.getPreviousTurn(0)).to.equal(3);
            expect(Util.getPreviousTurn(1)).to.equal(0);
            expect(Util.getPreviousTurn(2)).to.equal(1);
            expect(Util.getPreviousTurn(3)).to.equal(2);
        });
    });

    describe('#isSameTeam', ()=>{
        it("partner : true, opponent : false", ()=>{
            expect(Util.isSameTeam(0, 2)).to.be.true;
            expect(Util.isSameTeam(0, 1)).to.be.false;
        });
    });

    describe('#shiftTurn', () => {
        it('shift + 2', () => {
            expect(Util.shiftTurn(0, 2)).to.equal(2);
            expect(Util.shiftTurn(3, 2)).to.equal(1);
        });
        it('shift - 2', () => {
            expect(Util.shiftTurn(0, 2)).to.equal(2);
            expect(Util.shiftTurn(3, 2)).to.equal(1);
        });
    });
});