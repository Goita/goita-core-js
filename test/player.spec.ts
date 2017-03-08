import { Player, Koma, KomaArray, Define } from '../src';
import * as Chai from "chai";

const expect = Chai.expect;

describe('Player', () => {
    describe('#constructor', () => {
        it("create object", () => {
            let player = new Player(1, "11111111");
            expect(player.no).to.equal(1);
            expect(player.hand.length).to.equal(Define.maxFieldLength);
            expect(player.handCounter).to.equal(Define.maxFieldLength);
            expect(player.field.length).to.equal(Define.maxFieldLength);
            expect(player.fieldCounter).to.equal(0);
        });
    });

    describe('#hasKoma', () => {
        it("in hand", () => {
            let player = new Player(1, "22345678");
            expect(player.hasKoma(Koma.ou)).to.equal(true);
            expect(player.hasKoma(Koma.gyoku)).to.equal(true);
        });
        it("not in koma", () => {
            let player = new Player(1, "22345678");
            expect(player.hasKoma(Koma.shi)).to.equal(false);
        });
    });

    describe('#hasKomaExact', () => {
        it("in hand", () => {
            let player = new Player(1, "22345678");
            expect(player.hasKomaExact(Koma.ou)).to.equal(true);
        });
        it("not in koma", () => {
            let player = new Player(1, "22345678");
            expect(player.hasKomaExact(Koma.shi)).to.equal(false);
            expect(player.hasKomaExact(Koma.gyoku)).to.equal(false);
        });
    });

    describe('#countKoma', () => {
        it("in hand", () => {
            let player = new Player(1, "22345678");
            expect(player.countKoma(Koma.ou)).to.equal(1);
            expect(player.countKoma(Koma.gon)).to.equal(2);
        });
        it("not in koma", () => {
            let player = new Player(1, "22345678");
            expect(player.countKoma(Koma.shi)).to.equal(0);
        });
        it("counts ou including gyoku", () => {
            let player = new Player(1, "22345689");
            expect(player.countKoma(Koma.ou)).to.equal(2);
        });
    });

    describe('#putKoma', () => {
        it("put all in hand", () => {
            let player = new Player(1, "12345678");
            player.putKoma(Koma.shi, true);
            player.putKoma(Koma.gon);
            player.putKoma(Koma.bakko);
            player.putKoma(Koma.gin);
            player.putKoma(Koma.kin, true);
            player.putKoma(Koma.kaku);
            player.putKoma(Koma.hisha);
            player.putKoma(Koma.ou);
            expect(player.fieldCounter).to.equal(8);
            expect(player.handCounter).to.equal(0);
            expect(KomaArray.toString(player.field)).to.equal("x234x678");
            expect(KomaArray.toString(player.hand)).to.equal("00000000");
        });
        it("put an invalid koma", () => {
            let player = new Player(1, "11112228");
            expect(Player.prototype.putKoma.bind(player, Koma.gyoku)).throws();
            expect(Player.prototype.putKoma.bind(player, Koma.bakko)).throws();
        });
    });
    describe('#pickLastKoma', () => {
        it("remove put koma from field", () => {
            let player = new Player(1, "11111111");
            for (let i = 0; i < Define.maxFieldLength; i++) {
                player.putKoma(Koma.shi);
            }
            for (let i = 0; i < Define.maxFieldLength; i++) {
                player.pickLastKoma();
            }
            expect(player.handCounter).to.equal(Define.maxFieldLength);
            expect(player.fieldCounter).to.equal(0);
        });
        it("remove from field with no koma", () => {
            let player = new Player(1, "11112228");
            expect(Player.prototype.pickLastKoma.bind(player)).not.throw();
        });
        it("remove last 2 of 4", () => {
            let player = new Player(1, "84322211");
            player.putKoma(Koma.shi, true);
            player.putKoma(Koma.gon);
            player.putKoma(Koma.bakko);
            player.putKoma(Koma.gin);
            player.pickLastKoma();
            player.pickLastKoma();
            expect(player.fieldCounter).to.equal(2);
            expect(KomaArray.toString(player.field)).to.equal("x2000000");
            expect(KomaArray.toString(player.hand)).to.equal("84322100");
        });
    });

    describe('#getUniqueHand', () => {
        it("distinct", () => {
            let player = new Player(1, "11233558");
            expect(KomaArray.toString(player.getUniqueHand())).to.equal("12358");
        });
        it("ou and gyoku", () => {
            let player = new Player(1, "11122789");
            expect(KomaArray.toString(player.getUniqueHand())).to.equal("12789");
        });
    });

    describe('#getHiddenKoma', () => {
        it("face down list", () => {
            let player = new Player(1, "84322211");
            player.putKoma(Koma.shi, true);
            player.putKoma(Koma.gon);
            player.putKoma(Koma.bakko, true);
            player.putKoma(Koma.gin);
            expect(KomaArray.toString(player.getHiddenKoma())).to.equal("10300000");
        });
    });
});
