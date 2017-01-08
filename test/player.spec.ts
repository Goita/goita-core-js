/// <reference path="../typings/index.d.ts" />

import {Player, Koma, KomaArray, Define} from '../src';
import * as Chai from "chai";

describe('Player',()=>{
    describe('#constructor', ()=>{
        it("create object", ()=>{
            let player = new Player(1, "11111111");
            Chai.expect(player.no).to.equal(1);
            Chai.expect(player.hand.length).to.equal(Define.maxFieldLength);
            Chai.expect(player.handCounter).to.equal(Define.maxFieldLength);
            Chai.expect(player.field.length).to.equal(Define.maxFieldLength);
            Chai.expect(player.fieldCounter).to.equal(0);
        });
    });

    describe('#hasKoma', ()=>{
        it("in hand", ()=>{
            let player = new Player(1, "22345678");
            Chai.expect(player.hasKoma(Koma.ou)).to.equal(true);
            Chai.expect(player.hasKoma(Koma.gyoku)).to.equal(true);
        });
        it("not in koma", ()=>{
            let player = new Player(1, "22345678");
            Chai.expect(player.hasKoma(Koma.shi)).to.equal(false);
        });
    });

    describe('#hasKomaExact', ()=>{
        it("in hand", ()=>{
            let player = new Player(1, "22345678");
            Chai.expect(player.hasKomaExact(Koma.ou)).to.equal(true);
        });
        it("not in koma", ()=>{
            let player = new Player(1, "22345678");
            Chai.expect(player.hasKomaExact(Koma.shi)).to.equal(false);
            Chai.expect(player.hasKomaExact(Koma.gyoku)).to.equal(false);
        });
    });

    describe('#countKoma', ()=>{
        it("in hand", ()=>{
            let player = new Player(1, "22345678");
            Chai.expect(player.countKoma(Koma.ou)).to.equal(1);
            Chai.expect(player.countKoma(Koma.gon)).to.equal(2);
        });
        it("not in koma", ()=>{
            let player = new Player(1, "22345678");
            Chai.expect(player.countKoma(Koma.shi)).to.equal(0);
        });
        it("counts ou including gyoku", ()=>{
            let player = new Player(1, "22345689");
            Chai.expect(player.countKoma(Koma.ou)).to.equal(2);
        });
    });

    describe('#putKoma', ()=>{
        it("put all in hand", ()=>{
            let player = new Player(1, "12345678");
            player.putKoma(Koma.shi,true);
            player.putKoma(Koma.gon);
            player.putKoma(Koma.bakko);
            player.putKoma(Koma.gin);
            player.putKoma(Koma.kin, true);
            player.putKoma(Koma.kaku);
            player.putKoma(Koma.hisha);
            player.putKoma(Koma.ou);
            Chai.expect(player.fieldCounter).to.equal(8);
            Chai.expect(player.handCounter).to.equal(0);
            Chai.expect(KomaArray.toString(player.field)).to.equal("x234x678");
            Chai.expect(KomaArray.toString(player.hand)).to.equal("00000000");
        });
        it("put an invalid koma", ()=>{
            let player = new Player(1, "11112228");
            Chai.expect(Player.prototype.putKoma.bind(player, Koma.gyoku)).throw("Does not have the koma");
            Chai.expect(Player.prototype.putKoma.bind(player, Koma.bakko)).throw("Does not have the koma");
        });
    });
    describe('#pickLastKoma', ()=>{
        it("remove put koma from field", ()=>{
            let player = new Player(1, "11111111");
            for(let i=0;i<Define.maxFieldLength;i++){
                player.putKoma(Koma.shi);
            }
            for(let i=0;i<Define.maxFieldLength;i++){
                player.pickLastKoma();
            }
            Chai.expect(player.handCounter).to.equal(Define.maxFieldLength);
            Chai.expect(player.fieldCounter).to.equal(0);
        });
        it("remove from field with no koma", ()=>{
            let player = new Player(1, "11112228");
            Chai.expect(Player.prototype.pickLastKoma.bind(player)).not.throw();
        });
        it("remove last 2 of 4", ()=>{
            let player = new Player(1, "84322211");
            player.putKoma(Koma.shi,true);
            player.putKoma(Koma.gon);
            player.putKoma(Koma.bakko);
            player.putKoma(Koma.gin);
            player.pickLastKoma();
            player.pickLastKoma();
            Chai.expect(player.fieldCounter).to.equal(2);
            Chai.expect(KomaArray.toString(player.field)).to.equal("x2000000");
            Chai.expect(KomaArray.toString(player.hand)).to.equal("84322100");
        });
    });

    describe('#getUniqueHand', ()=>{
        it("distinct", ()=>{
            let player = new Player(1, "11233558");
            Chai.expect(KomaArray.toString(player.getUniqueHand())).to.equal("12358");
        });
        it("ou and gyoku", ()=>{
            let player = new Player(1, "11122789");
            Chai.expect(KomaArray.toString(player.getUniqueHand())).to.equal("12789");
        });
    });

    describe('#getHiddenKoma', ()=>{
        it("face down list", ()=>{
            let player = new Player(1, "84322211");
            player.putKoma(Koma.shi, true);
            player.putKoma(Koma.gon);
            player.putKoma(Koma.bakko, true);
            player.putKoma(Koma.gin);
            Chai.expect(KomaArray.toString(player.getHiddenKoma())).to.equal("10300000");
        });
    });
});