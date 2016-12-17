/// <reference path="../typings/index.d.ts" />

import {Koma, KomaCollection} from "../src";
import * as Chai from "chai";

describe('Koma',()=>{
    let list :KomaCollection;
    beforeEach(()=>{
        list = new KomaCollection();
        list.push(Koma.Shi);
        list.push(Koma.Gon);
    });

    describe('#indexOf', ()=>{
        it("search method success", ()=>{
            let ret = list.indexOf(Koma.Gon);
            Chai.expect(ret).to.equals(1);
        });
    });
});