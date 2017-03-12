import * as Chai from "chai";
import { Board } from '../src/board';
import { DealOptions } from "../src/dealoptions";

const expect = Chai.expect;

describe('DealOptions', () => {
    describe('#areValid', () => {
        it("default options === {noGoshi:false, noYaku:false}", () => {
            const options = new DealOptions();
            expect(options.noGoshi).to.be.false;
            expect(options.noYaku).to.be.false;
        });
        it("{noGoshi:false, noYaku:false} => goshi", () => {
            const b = Board.createFromString("33222233,11111668,11444477,11155559,s1");
            const options = new DealOptions();
            expect(options.areValid(b)).to.be.true;
        });
        it("{noGoshi:true, noYaku:false} => goshi", () => {
            const b = Board.createFromString("33222233,11111668,11444477,11155559,s1");
            const options = new DealOptions();
            options.noGoshi = true;
            options.noYaku = false;
            expect(options.areValid(b)).to.be.false;
        });
        it("{noGoshi:false, noYaku:false} => rokushi", () => {
            const b = Board.createFromString("33222233,11111166,11444477,11855559,s1");
            const options = new DealOptions();
            expect(options.areValid(b)).to.be.true;
        });
        it("{noGoshi:false, noYaku:true} => rokushi", () => {
            const b = Board.createFromString("33222233,11111166,11444477,11855559,s1");
            const options = new DealOptions();
            options.noGoshi = false;
            options.noYaku = true;
            expect(options.areValid(b)).to.be.false;
        });
    });
});
