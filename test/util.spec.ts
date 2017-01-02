/// <reference path="../typings/index.d.ts" />

import {Define, Util} from '../src';
import * as Chai from "chai";

describe('Util',()=>{
    let komaCircle: Array<string>;
    beforeEach(()=>{
        komaCircle = Define.komaCircle.split("");
    });

    describe('#cut', ()=>{
        it("should devide 32 elements array by 8 into 4 arrays", ()=>{
            let ret = Util.cut(komaCircle, 8);
            Chai.expect(ret.length).to.equals(4);
        });

        it("should devide komaCircle by 8 into 4 arrays and the results are correct", ()=>{
            let ret = Util.cut(komaCircle, 8);
            Chai.expect(ret[0].join("")).to.equals("11111111");
            Chai.expect(ret[1].join("")).to.equals("11222233");
            Chai.expect(ret[2].join("")).to.equals("33444455");
            Chai.expect(ret[3].join("")).to.equals("55667789");
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
            Chai.expect(sumIndex/loop).to.within(14.5, 16.5);
            // 31/2 = 15.5
        });
    });

    describe('#dealTegomas', ()=>{
        it("get array of string", ()=>{
            let ret = Util.dealTegomas();
            Chai.expect(ret.length).to.equal(Define.maxPlayers);
            Chai.expect(ret[0].length).to.equal(Define.maxFieldLength);
            Chai.expect(ret[1].length).to.equal(Define.maxFieldLength);
            Chai.expect(ret[2].length).to.equal(Define.maxFieldLength);
            Chai.expect(ret[3].length).to.equal(Define.maxFieldLength);
        });
    });
});