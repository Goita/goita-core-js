/// <reference path="../typings/index.d.ts" />

import {Define} from '../src';
import {Util} from "../src";
import * as Chai from "chai";

describe('Util',()=>{
    let komaCircle: Array<string>;
    beforeEach(()=>{
        komaCircle = Define.KOMA_CIRCLE.split("");
    });

    describe('#cut', ()=>{
        it("should devide 32 elements array by 8 into 4 arrays", ()=>{
            let ret = Util.cut(komaCircle, 8);
            Chai.expect(ret.length).to.equals(4);
        });

        it("should devide KOMA_CIRCLE by 8 into 4 arrays and the results are correct", ()=>{
            let ret = Util.cut(komaCircle, 8);
            Chai.expect(ret[0].join("")).to.equals("11111111");
            Chai.expect(ret[1].join("")).to.equals("11222233");
            Chai.expect(ret[2].join("")).to.equals("33444455");
            Chai.expect(ret[3].join("")).to.equals("55667789");
        });
    });
});