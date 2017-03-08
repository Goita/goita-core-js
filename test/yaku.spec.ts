import * as Chai from "chai";
import { Board } from '../src/board';
import { YakuInfo } from '../src/yaku';
import { Yaku } from '../src/define';

const expect = Chai.expect;

describe('YakuInfo', () => {
    describe('#from', () => {
        it("detects no yaku", () => {
            const b = Board.createFromString("11222233,11133668,11444477,11155559,s1");
            const info = YakuInfo.from(b.players);
            expect(info.length).to.equal(0);
        });
        it("detects goshi", () => {
            const b = Board.createFromString("11222233,11111668,33444477,11155559,s1");
            const info = YakuInfo.from(b.players);
            expect(info.length).to.equal(1);
            expect(info[0].yaku).to.equal(Yaku.goshi);
            expect(info[0].playerNo).to.equal(1);
        });
        it("detects rokushi", () => {
            const b = Board.createFromString("11222233,11111661,33444477,11855559,s1");
            const info = YakuInfo.from(b.players);
            expect(info.length).to.equal(1);
            expect(info[0].yaku).to.equal(Yaku.rokushi);
            expect(info[0].playerNo).to.equal(1);
        });
        it("detects nanashi", () => {
            const b = Board.createFromString("11222233,55551668,33444477,11191111,s1");
            const info = YakuInfo.from(b.players);
            expect(info.length).to.equal(1);
            expect(info[0].yaku).to.equal(Yaku.nanashi);
            expect(info[0].playerNo).to.equal(3);
        });
        it("detects hachishi", () => {
            const b = Board.createFromString("11111111,22221668,33444477,13355559,s1");
            const info = YakuInfo.from(b.players);
            expect(info.length).to.equal(1);
            expect(info[0].yaku).to.equal(Yaku.hachishi);
            expect(info[0].playerNo).to.equal(0);
        });
        it("detects goshigoshi win", () => {
            const b = Board.createFromString("55222233,11111668,33444477,11111559,s1");
            const info = YakuInfo.from(b.players);
            expect(info.length).to.equal(2);
            expect(info[0].yaku).to.equal(Yaku.goshigoshi_win);
            expect(info[1].yaku).to.equal(Yaku.goshigoshi_win);
            expect(info[0].playerNo).to.equal(1);
            expect(info[1].playerNo).to.equal(3);
        });
        it("detects goshigoshi opposite", () => {
            const b = Board.createFromString("55222233,33444477,11111559,11111668,s1");
            const info = YakuInfo.from(b.players);
            expect(info.length).to.equal(2);
            expect(info[0].yaku).to.equal(Yaku.goshigoshi_opposite);
            expect(info[1].yaku).to.equal(Yaku.goshigoshi_opposite);
            expect(info[0].playerNo).to.equal(2);
            expect(info[1].playerNo).to.equal(3);
        });
        it("accepts string array", () => {
            const strarray:string[] = ["11222233","11111668","33444477","11155559"];
            const info = YakuInfo.from(strarray);
            expect(info.length).to.equal(1);
            expect(info[0].yaku).to.equal(Yaku.goshi);
            expect(info[0].playerNo).to.equal(1);
        });
    });
});
