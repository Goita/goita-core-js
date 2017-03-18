import { Factory } from '../src';
import * as Chai from "chai";

const expect = Chai.expect;

describe('Game', () => {
    describe('#setInitialScore', () => {
        it("set 0,0", () => {
            const game = Factory.createGame();
            game.startNewGame();

            expect(game.roundCount).to.equal(1);
            expect(game.scores[0]).to.equal(0);
            expect(game.scores[1]).to.equal(0);
        });
        it("set 140,50", () => {
            const game = Factory.createGame();
            game.setInitialScore([140, 50]);
            game.startNewGame();
            expect(game.roundCount).to.equal(1);
            expect(game.scores[0]).to.equal(140);
            expect(game.scores[1]).to.equal(50);
        });
    });
    describe("#isEnd", () => {
        it("returns false with 140,140 score", () => {
            const game = Factory.createGame();
            game.setInitialScore([140, 140]);
            game.startNewGame();
            expect(game.isEnd).to.be.false;
        });
        it("returns true with 150,0 score", () => {
            const game = Factory.createGame();
            game.setInitialScore([150, 0]);
            game.startNewGame();
            expect(game.isEnd).to.be.true;
        });
        it("latest board status should be effected", () => {
            const game = Factory.createGame();
            game.setInitialScore([140, 0]);
            game.startNewGame();
            game.startNewDealWithInitialState("22221678,11111345,11345679,11345345,s1,112,2p,3p,4p,162,2p,3p,4p,172,2p,3p,4p,128");
            expect(game.isEnd).to.be.true;
        });
    });
    describe("#scores", () => {
        it("count 6 shi", () => {
            const game = Factory.createGame();
            game.startNewGame();
            game.startNewDealWithInitialState("11111178,22234567,11433569,11234455,s1");
            game.startNewDealWithInitialState("11112278,11234567,11433569,11234455,s1");
            expect(game.scores).to.deep.equal([50, 0]);
        });
    });
});
