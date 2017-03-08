import { Koma, KomaArray } from "../src";
import * as Chai from "chai";

const expect = Chai.expect;

describe("Koma", () => {
    describe("#Score", () => {
        it("throw exception to get hidden koma's score", () => {
            try {
                const s = Koma.hidden.Score;
                throw new Error("Koma.hidden.Score should throw an error, but got " + s);
            } catch (ex) {
                expect((<Error>ex).message).to.equal("cannot get the score of Koma.hidden");
            }
        });
    });
});

describe('KomaArray', () => {
    let list: Array<Koma>;
    beforeEach(() => {
    });

    describe('#sortAsc', () => {
        it("sort order by ascending", () => {
            list = new Array<Koma>();
            list.push(Koma.shi);
            list.push(Koma.gon);
            list.push(Koma.shi);
            KomaArray.sortAsc(list);
            expect(list[0]).to.equals(Koma.shi);
            expect(list[2]).to.equals(Koma.gon);
        });
    });
    describe('#sortDesc', () => {
        it("sort order by descending", () => {
            list = new Array<Koma>();
            list.push(Koma.shi);
            list.push(Koma.gon);
            list.push(Koma.shi);
            KomaArray.sortDesc(list);
            expect(list[0]).to.equals(Koma.gon);
            expect(list[2]).to.equals(Koma.shi);
        });
    });

    describe('#createEmptyField', () => {
        it("hand array from string", () => {
            list = KomaArray.createEmptyField();
            expect(KomaArray.toString(list)).to.equals("00000000");
        });
    });
    describe('#createFrom', () => {
        it("hand array from string", () => {
            list = KomaArray.createFrom("11223344");
            expect(KomaArray.toString(list)).to.equals("11223344");
        });
    });
});
