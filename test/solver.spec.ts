import {Solver} from '../src';
import * as Chai from "chai";

const expect = Chai.expect;

describe('Solver',()=>{
    describe('#solve', ()=>{
        // it("from middle of playing", ()=>{
        //     let solver = new Solver();
        //     let results = solver.solve("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315");
        //     expect(results).is.not.empty;
        // });
        it("last few moves", ()=>{
            const solver = new Solver();
            const results = solver.solve("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315,4p,1p,2p,343,4p,1p,2p,321,4p,1p,213,3p,4p,1p,245,3p,452,126,262,3p");
            expect(results.some(r=>r.score === 50)).to.be.true;
        });
        it("from end of playing", ()=>{
            let solver = new Solver();
            let results = solver.solve("22221678,11113345,11145679,11345345,s1,112,2p,3p,4p,162,2p,3p,4p,172,2p,3p,4p,128");
            expect(results).is.empty;
        });
    });
});