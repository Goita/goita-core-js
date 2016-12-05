/// <reference path="../typings/index.d.ts" />

import {Core} from "../src/exports";
import * as Chai from "chai";

describe('Core',()=>{
    let core :Core;
    beforeEach(()=>{
        core = new Core();
    });

    describe('#hello', ()=>{
        it("should return hello and given name", ()=>{
            let ret = core.hello("test");
            Chai.expect(ret).to.equals("hello test");
        });
    });
});