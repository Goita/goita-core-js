/// <reference path="../typings/index.d.ts" />

import {Koma, KomaCollection} from "../src";
import * as Chai from "chai";

describe('Koma',()=>{
    let list :KomaCollection;
    beforeEach(()=>{
        list = new KomaCollection();
        list.push(Koma.shi);
        list.push(Koma.gon);
    });

    describe('#indexOf', ()=>{
        it("search method success", ()=>{
            let ret = list.indexOf(Koma.gon);
            Chai.expect(ret).to.equals(1);
        });
    });
});