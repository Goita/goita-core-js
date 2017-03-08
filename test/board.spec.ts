import { Board, Koma, KomaArray } from '../src';
import * as Chai from "chai";
import { Yaku } from '../src/define';

const expect = Chai.expect;

describe('Board', () => {
    let testBoard: Board;
    beforeEach(() => {
        testBoard = Board.createFromString("12345678,12345679,11112345,11112345,s1");
    });

    describe('#constructor', () => {
        it("create object", () => {
            let dealer = 2;
            let table = Board.createRandomly(dealer);
            expect(table.turnPlayer.no).to.equal(dealer);
            expect(table.history.lastAttacker).to.equal(dealer);
            expect(table.history.turn).to.equal(dealer);
            expect(table.history.moveStack.length).to.equal(0);
        });
    });

    describe('#play', () => {
        it("face down", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            expect(testBoard.turnPlayer.no, "next player's turn").to.equal(1);
            expect(testBoard.history.lastMove.faceDown, "first play must be a face down move").to.equal(true);
        });
        it("match", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.play(Koma.bakko, Koma.kaku);
            expect(testBoard.history.lastMove.faceDown).to.equal(false);
            expect(testBoard.history.lastMove.toOpenString()).to.equal("236");
        });
    });

    describe('#canPlay', () => {
        //dealer turn
        it("returns true with a right move on dealer turn", () => {
            expect(testBoard.canPlay(Koma.shi, Koma.bakko)).to.equal(true);
        });
        it("doesn't have 2 shi on dealer turn", () => {
            expect(testBoard.canPlay(Koma.shi, Koma.shi)).to.equal(false);
        });
        //after the dealer's attack
        it("can match", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            expect(testBoard.canPlay(Koma.bakko, Koma.kaku)).to.equal(true);
        });
        it("cannot match with wrong koma", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            expect(testBoard.canPlay(Koma.shi, Koma.kaku)).to.equal(false);
        });
        it("cannot match with a koma not in hand", () => {
            testBoard.play(Koma.shi, Koma.kaku);
            testBoard.pass();
            //hand: 11112345
            expect(testBoard.canPlay(Koma.kaku, Koma.shi)).to.equal(false);
        });
        it("returns false because same 2 koma not in hand", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            expect(testBoard.canPlay(Koma.kaku, Koma.kaku)).to.equal(false);
        });
        //2nd attack after 3pass
        it("returns true with a correct 2nd attack", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.pass();
            testBoard.pass();
            testBoard.pass();
            //hand: 02045678
            expect(testBoard.canPlay(Koma.gin, Koma.kaku)).to.equal(true);
        });
        it("returns false with a wrong 2nd attack", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.pass();
            testBoard.pass();
            testBoard.pass();
            //hand: 02045678
            expect(testBoard.canPlay(Koma.shi, Koma.bakko)).to.equal(false);
        });
        //using the king
        it("cannot attack with the ou on the dealer turn", () => {
            expect(testBoard.canPlay(Koma.shi, Koma.ou)).to.equal(false);
        });
        it("returns true with the ou attack after gyoku used", () => {
            testBoard.play(Koma.shi, Koma.kaku);
            testBoard.play(Koma.gyoku, Koma.bakko);
            testBoard.pass();
            testBoard.pass();
            expect(testBoard.canPlay(Koma.bakko, Koma.ou)).to.equal(true);
        });
        it("can attack with the ou on the double king hand", () => {
            let ddBoard = Board.createFromString("23456789,11234567,11112345,11112345,s1");
            expect(ddBoard.canPlay(Koma.bakko, Koma.ou)).to.equal(true);
        });
    });

    describe('#pass', () => {
        it("pass", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.pass();
            expect(testBoard.history.lastMove.pass).to.equal(true);
            expect(testBoard.history.turn).to.equal(2);
        });
    });

    describe('#canPass', () => {
        it("returns false on dealer turn", () => {
            expect(testBoard.canPass()).to.equal(false);
        });
        it("returns true on 2nd turn", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            expect(testBoard.canPass()).to.equal(true);
        });
        it("returns false after 3pass", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.pass();
            testBoard.pass();
            testBoard.pass();
            expect(testBoard.canPass()).to.equal(false);
        });
    });

    describe('#undo', () => {
        it("rollbacks history", () => {
            let initialState = testBoard.toHistoryString();
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.undo();
            let rollbackedState = testBoard.toHistoryString();
            expect(initialState).to.equal(rollbackedState);
        });
        it("undo pass", () => {
            let before = Board.createFromString("12345678,12345679,11112345,11112345,s1,112");
            let after = Board.createFromString("12345678,12345679,11112345,11112345,s1,112");
            after.pass();
            after.undo();
            expect(after.turnPlayer.no, "check turn player No.").to.equal(before.turnPlayer.no);
            expect(after.history.attackerLog.join()).to.equal(before.history.attackerLog.join());
        });
    });

    describe('#canUndo', () => {
        it("returns true a move stacked on history", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            expect(testBoard.canUndo()).to.equal(true);
        });
        it("returns false no move stacked on history", () => {
            expect(testBoard.canUndo()).to.equal(false);
        });
    });

    describe('#redo', () => {
        it("resumes a rollback", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            let initialState = testBoard.toHistoryString();
            testBoard.undo();
            testBoard.redo();
            let resumedState = testBoard.toHistoryString();
            expect(initialState).to.equal(resumedState);
        });
        it("redo pass", () => {
            let before = Board.createFromString("12345678,12345679,11112345,11112345,s1,112");
            let after = Board.createFromString("12345678,12345679,11112345,11112345,s1,112");
            before.pass();
            after.pass();
            after.undo();
            after.redo();
            expect(after.turnPlayer.no, "check turn player No.").to.equal(before.turnPlayer.no);
            expect(after.history.attackerLog.join()).to.equal(before.history.attackerLog.join());
        });
    });

    describe('#canRedo', () => {
        it("returns true after 'undo'", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            testBoard.undo();
            expect(testBoard.canRedo()).to.equal(true);
        });
        it("returns false before 'undo'", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            expect(testBoard.canRedo()).to.equal(false);
        });
    });

    describe('#createFromString', () => {
        it("testBoard", () => {
            let board = Board.createFromString("12345678,12345679,11112345,11112345,s1");
            expect(board.turnPlayer.no).to.equal(0);
            expect(board.history.moveStack.length).to.equal(0);
            expect(KomaArray.toString(board.players[0].hand)).to.equal("12345678");
            expect(KomaArray.toString(board.players[1].hand)).to.equal("12345679");
            expect(KomaArray.toString(board.players[2].hand)).to.equal("11112345");
            expect(KomaArray.toString(board.players[3].hand)).to.equal("11112345");
        });
        it("end of playing", () => {
            let board = Board.createFromString("22221678,11111345,11345679,11345345,s1,112,2p,3p,4p,162,2p,3p,4p,172,2p,3p,4p,128");
            expect(board.history.lastMove.finish).to.be.true;
        });
    });

    describe('#toThinkingInfo', () => {
        it("first turn", () => {
            let info = testBoard.toThinkingInfo();
            let turn = testBoard.turnPlayer.no;
            expect(info.hand).to.equal(testBoard.history.hands[turn]);
            expect(info.fields[0]).to.equal(KomaArray.toString(testBoard.players[0].field));
            expect(info.fields[1]).to.equal(KomaArray.toString(testBoard.players[1].field));
            expect(info.fields[2]).to.equal(KomaArray.toString(testBoard.players[2].field));
            expect(info.fields[3]).to.equal(KomaArray.toString(testBoard.players[3].field));
            expect(info.lastAttack).is.null;
            expect(info.turn).to.equal(turn);
            expect(info.kingUsed).to.equal(testBoard.history.kingUsed > 0);
            expect(info.dealer).to.equal(testBoard.history.dealer);
            expect(info.hiddenField).to.equal(KomaArray.toString(testBoard.players[0].hiddenfield));
            expect(info.history).to.equal("");
            expect(info.yakuInfo.length).to.equal(0);
        });
        it("second turn", () => {
            testBoard.play(Koma.shi, Koma.bakko);
            const h_before = testBoard.toHistoryString();
            let info = testBoard.toThinkingInfo();
            const h_after = testBoard.toHistoryString();
            let turn = testBoard.turnPlayer.no;
            expect(info.hand).to.equal(testBoard.history.hands[turn]);
            expect(info.fields[0]).to.equal(KomaArray.toString(testBoard.players[0].field));
            expect(info.fields[1]).to.equal(KomaArray.toString(testBoard.players[1].field));
            expect(info.fields[2]).to.equal(KomaArray.toString(testBoard.players[2].field));
            expect(info.fields[3]).to.equal(KomaArray.toString(testBoard.players[3].field));
            expect(info.lastAttack.toString()).to.equal(testBoard.history.lastMove.toString());
            expect(info.lastAttack.block).to.equal(Koma.hidden);
            expect(info.turn).to.equal(turn);
            expect(info.kingUsed).to.equal(testBoard.history.kingUsed > 0);
            expect(info.dealer).to.equal(testBoard.history.dealer);
            expect(info.hiddenField).to.equal(KomaArray.toString(testBoard.turnPlayer.hiddenfield));
            expect(info.history).to.equal("1x3");
            // toThinkingInfo() must not affect any of board history
            expect(h_before).to.equal(h_after);
        });

        it("end of playing", () => {
            let board = Board.createFromString("22221678,11111345,11345679,11345345,s1,112,2p,3p,4p,162,2p,3p,4p,172,2p,3p,4p,128");
            let info = board.toThinkingInfo();
            expect(info.lastAttack.finish).to.be.true;
            expect(info.fields[0]).to.equal("x2x2x228");
        });
    });

    describe('#isGoshiSuspended', () => {
        it("goshi", () => {
            let board = Board.createFromString("11111678,12345679,11112345,23452345,s1");
            expect(board.isGoshiSuspended).to.equal(true);
        });
        it("goshigoshi oppisite", () => {
            let board = Board.createFromString("11111678,11111345,22345679,23452345,s1");
            expect(board.isGoshiSuspended).to.equal(true);
        });
        it("not goshi", () => {
            let board = Board.createFromString("11112678,12345679,11112345,13452345,s1");
            expect(board.isGoshiSuspended).to.equal(false);
        });
    });

    describe('#goshiPlayerNo', () => {
        it('return -1 when not goshi', () => {
            const board = Board.createFromString("11112678,12345679,11112345,13452345,s1");
            expect(board.goshiPlayerNo.length).to.equal(0);
        });

        it('goshi player no', () => {
            const board = Board.createFromString("12345679,11111678,11112345,23452345,s1");
            expect(board.goshiPlayerNo[0]).to.equal(1);
        });
        it("goshigoshi oppisite", () => {
            let board = Board.createFromString("11111678,22345679,23452345,11111345,s1");
            expect(board.goshiPlayerNo[0]).to.equal(0);
            expect(board.goshiPlayerNo[1]).to.equal(3);
        });
    });

    describe('#yakuInfo', () => {
        it("not goshi", () => {
            let board = Board.createFromString("11112678,12345679,11132345,11452345,s1");
            expect(board.yakuInfo.length).to.equal(0);
        });
        it("goshi", () => {
            let board = Board.createFromString("11111678,12345679,11112345,23452345,s1");
            expect(board.yakuInfo.length).to.equal(1);
            const info = board.yakuInfo[0];
            expect(info.playerNo).to.equal(0);
            expect(info.yaku).to.equal(Yaku.goshi);
        });
        it("goshigoshi oppisite", () => {
            let board = Board.createFromString("11111678,11111345,22345679,23452345,s1");
            expect(board.yakuInfo.length).to.equal(2);
            const info1 = board.yakuInfo[0];
            const info2 = board.yakuInfo[1];
            expect(info1.playerNo).to.equal(0);
            expect(info1.yaku).to.equal(Yaku.goshigoshi_opposite);
            expect(info2.playerNo).to.equal(1);
            expect(info2.yaku).to.equal(Yaku.goshigoshi_opposite);
        });
    });

    describe('#isEndOfDeal', () => {
        it("goshi continue", () => {
            let board = Board.createFromString("11111678,12345679,11112345,23452345,s1");
            board.continueGoshi();
            expect(board.isEndOfDeal).to.equal(false);
        });
        it("goshi redeal", () => {
            let board = Board.createFromString("11111678,12345679,11112345,23452345,s1");
            board.redeal();
            expect(board.isEndOfDeal).to.equal(true);
        });
        it("rokushi", () => {
            let board = Board.createFromString("11111167,23456789,11112345,23452345,s1");
            expect(board.isEndOfDeal).to.equal(true);
        });
        it("nanashi", () => {
            let board = Board.createFromString("11111117,23456789,11172345,23452345,s1");
            expect(board.isEndOfDeal).to.equal(true);
        });
        it("hachishi", () => {
            let board = Board.createFromString("11111111,23456789,11772345,23452345,s1");
            expect(board.isEndOfDeal).to.equal(true);
        });
        it("goshigoshi win", () => {
            let board = Board.createFromString("11111678,22345679,11111345,23452345,s1");
            expect(board.isEndOfDeal).to.equal(true);
        });
        it("goshigoshi oppisite", () => {
            let board = Board.createFromString("11111678,11111345,22345679,23452345,s1");
            expect(board.isEndOfDeal).to.equal(false);
        });

        it("end of play", () => {
            let board = Board.createFromString("22221678,11111345,11345679,11345345,s1,112,2p,3p,4p,162,2p,3p,4p,172,2p,3p,4p,128");
            expect(board.isEndOfDeal).to.equal(true);
        });
    });

    describe('#getFinishState', () => {
        it("goshi redeal", () => {
            let board = Board.createFromString("11111678,12345679,11112345,23452345,s1");
            board.redeal();
            expect(board.getFinishState().redeal).to.equal(true);
            expect(board.getFinishState().nextDealerNo).to.equal(0);
        });
        it("rokushi", () => {
            let board = Board.createFromString("23456789,11112345,23452345,11111167,s1");
            expect(board.getFinishState().redeal).to.equal(false);
            expect(board.getFinishState().nextDealerNo).to.equal(3);
        });
        it("nanashi", () => {
            let board = Board.createFromString("23456789,11162345,23452345,11111117,s1");
            expect(board.getFinishState().redeal).to.equal(false);
            expect(board.getFinishState().nextDealerNo).to.equal(3);
        });
        it("hachishi", () => {
            let board = Board.createFromString("23456789,11772345,23452345,11111111,s1");
            expect(board.getFinishState().redeal).to.equal(false);
            expect(board.getFinishState().nextDealerNo).to.equal(3);
        });
        it("goshigoshi win", () => {
            let board = Board.createFromString("11111678,22345679,11111345,23452345,s1");
            expect(board.getFinishState().redeal).to.equal(false);
            expect(board.getFinishState().nextDealerNo).to.equal(0);
        });
        it("goshigoshi opposite redeal", () => {
            let board = Board.createFromString("11111678,11111345,22345679,23452345,s2");
            board.redeal();
            expect(board.getFinishState().redeal).to.equal(true);
            expect(board.getFinishState().nextDealerNo).to.equal(1);
        });

        it("end of play", () => {
            let board = Board.createFromString("22221678,11113345,11145679,11345345,s1,112,2p,3p,4p,162,2p,3p,4p,172,2p,3p,4p,128");
            expect(board.getFinishState().nextDealerNo).to.equal(0);
            expect(board.getFinishState().redeal).to.equal(false);
            expect(board.getFinishState().nextDealerNo).to.equal(0);
        });
    });
});
