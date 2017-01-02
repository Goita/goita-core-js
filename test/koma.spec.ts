/// <reference path="../typings/index.d.ts" />

import {Koma, KomaArray} from "../src";
import * as Chai from "chai";

describe('KomaArray',()=>{
    let list :Array<Koma>;
    beforeEach(()=>{
    });

    describe('#sortAsc', ()=>{
        it("sort order by ascending", ()=>{
            list = new Array<Koma>();
            list.push(Koma.shi);
            list.push(Koma.gon);
            list.push(Koma.shi);
            KomaArray.sortAsc(list);
            Chai.expect(list[0]).to.equals(Koma.shi);
            Chai.expect(list[2]).to.equals(Koma.gon);
        });
    });
    describe('#sortDesc', ()=>{
        it("sort order by descending", ()=>{
            list = new Array<Koma>();
            list.push(Koma.shi);
            list.push(Koma.gon);
            list.push(Koma.shi);
            KomaArray.sortDesc(list);
            Chai.expect(list[0]).to.equals(Koma.gon);
            Chai.expect(list[2]).to.equals(Koma.shi);
        });
    });

    describe('#createEmptyField', ()=>{
        it("hand array from string", ()=>{
            list = KomaArray.createEmptyField();
            Chai.expect(KomaArray.toString(list)).to.equals("00000000");
        });
    });
    describe('#createHandFrom', ()=>{
        it("hand array from string", ()=>{
            list = KomaArray.createHandFrom("11223344");
            Chai.expect(KomaArray.toString(list)).to.equals("11223344");
        });
    });
});