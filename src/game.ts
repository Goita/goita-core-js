import { Define } from './define';
import { Util } from './util';
import { Board } from './board';
import { DealOptions } from "./dealoptions";

/** Goita Game Class */
export class Game {
    public winScore: number;
    public roundCount: number;
    public scores: Array<number>;
    public initialScores: Array<number>;
    public dealOptions: DealOptions;
    public board: Board;
    public history: Array<Board>;

    public constructor() {
        this.init();
    }

    private init() {
        this.history = new Array<Board>();
        this.board = null;
        this.winScore = Define.defaultWinScore;
        this.scores = [0, 0];
        this.initialScores = [0, 0];
        this.dealOptions = new DealOptions();
    }

    public setInitialScore(scores: number[]): void {
        this.initialScores = scores;
        this.updateGameState();
    }

    public setDealOptions(options: DealOptions): void {
        this.dealOptions = options;
    }

    /** set up a new game */
    public startNewGame() {
        this.history = new Array<Board>();
        this.board = null;
        this.updateGameState();
    }

    /** set up a new board */
    public startNewDeal() {
        let dealer: number;

        if (this.board && this.board.isEndOfDeal) {
            this.history.push(this.board);
            dealer = this.board.getFinishState().nextDealerNo;
        } else {
            dealer = Util.rand.integer(0, 3);
        }
        this.board = Board.createRandomly(dealer);
        this.updateGameState();
    }

    /** set up a new board with history string */
    public startNewDealWithInitialState(history: string) {
        if (this.board && this.board.isEndOfDeal) {
            this.history.push(this.board);
        }
        this.board = Board.createFromString(history);
        this.updateGameState();
    }

    private updateGameState(): void {
        this.roundCount = 1;

        this.scores = this.initialScores.slice();
        const scanBoard = (board: Board): void => {
            if (board && board.isEndOfDeal) {
                const f = board.getFinishState();
                if (f.redeal || f.aborted) {
                    return;
                }
                if (board.yakuInfo.some((yi) => yi.isFinishingPlay)) {

                } else {
                    const m = board.history.lastMove;
                    if (!m) {
                        throw new Error("lastMove is null when the board is EndOfDeal. history: " + board.toHistoryString());
                    }
                    this.scores[m.no % 2] += m.toScore();
                    this.roundCount++;
                }
            }
        };
        for (const board of this.history) {
            scanBoard(board);
        }
        scanBoard(this.board);
    }

    /** returns true if any team's score reach to win-score */
    public get isEnd(): boolean {
        this.updateGameState();
        for (const s of this.scores) {
            if (s >= this.winScore) {
                return true;
            }
        }
        return false;
    }
}
