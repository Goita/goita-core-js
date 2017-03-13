import { Util } from './util';
import { Move } from './history';
import { Board } from './board';
import { EvaluatedMove } from './ai.interface';

/** Goita board solver class */
export class Solver {
    //public win_lose_search: boolean;
    private board: Board;
    private playerNo: number;
    public searchedLeaf: number;
    public searchedMoves: number;

    public constructor() {
        this.init();
    }

    private init() {
        //this.win_lose_search = false;
    }

    public solve(historyString: string): EvaluatedMove[] {
        this.searchedLeaf = 0;
        this.searchedMoves = 0;

        this.board = Board.createFromString(historyString);
        this.playerNo = this.board.turnPlayer.no;
        let evaledMoves = new Array<EvaluatedMove>();
        let info = this.board.toThinkingInfo();
        let moves = info.getPossibleMoves();
        for (let move of moves) {
            let v = this.alpha_beta_search(move, new EvalScore(-999), new EvalScore(999));
            evaledMoves.push(new EvaluatedMove(move, v.score, v.history));
            this.searchedMoves++;
            // console.log("search done: " + move.toOpenString());
        }
        return evaledMoves;
    }

    private eval(): number {
        if (!this.board.isEndOfDeal) {
            throw new Error("cannot eval because the board is end of deal");
        }
        this.searchedLeaf++;
        if (this.searchedLeaf % 10000 === 0) {
            // console.log("searched leaf: " + this.searchedLeaf);
        }
        return this.board.history.lastMove.toScore();
    }

    /**
     * @min prune search if score is under min value
     * @max prune search if score is upper max value
     */
    private alpha_beta_search(move: Move, min: EvalScore, max: EvalScore): EvalScore {
        this.board.playMove(move);
        if (this.board.isEndOfDeal) {
            let score = this.eval();
            if (!Util.isSameTeam(this.playerNo, move.no)) {
                score *= -1;
            }
            let history = this.board.toHistoryString();
            this.board.undo();
            return new EvalScore(score, history);
        }
        let moves = this.board.toThinkingInfo().getPossibleMoves();
        let v: EvalScore;
        const movesCount = moves.length;
        if (Util.isSameTeam(this.playerNo, this.board.turnPlayer.no)) {
            v = min;
            for (let i = 0; i < movesCount; i = (i + 1) | 0) {
                let move = moves[i];
                let t = this.alpha_beta_search(move, v, max);
                if (t.score > v.score) {
                    v = t;
                }
                if (v.score > max.score) {
                    this.board.undo();
                    return max;
                }
            }
        } else {
            v = max;
            for (let i = 0; i < movesCount; i = (i + 1) | 0) {
                let move = moves[i];
                let t = this.alpha_beta_search(move, min, v);
                if (t.score < v.score) {
                    v = t;
                }
                if (v.score < min.score) {
                    this.board.undo();
                    return min;
                }
            }
        }
        this.board.undo();
        return v;
    }
}

class EvalScore {
    public score: number;
    public history: string;
    public constructor(score: number, history: string = null) {
        this.score = score;
        this.history = history;
    }
}
