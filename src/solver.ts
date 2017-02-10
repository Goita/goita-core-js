import {Util} from './util';
import {Move} from './history';
import {Board} from './board';
import {EvaluatedMove} from './ai.interface';

/** Goita board solver class */
export class Solver{
    public win_lose_search: boolean;
    public board: Board;
    private playerNo: number;

    public constructor(){
        this.init();
    }

    private init(){
        this.win_lose_search = false;
    }

    public solve(historyString: string): EvaluatedMove[]{
        this.board = Board.createFromString(historyString);
        this.playerNo = this.board.turnPlayer.no;
        let evaledMoves = new Array<EvaluatedMove>();
        let info = this.board.toThinkingInfo();
        let moves = info.getPossibleMoves();
        for(let move of moves){
            let v = this.alpha_beta_search(move, 999, -999);
            evaledMoves.push(new EvaluatedMove(move, v));
        }
        return evaledMoves;
    }

    private eval(): number{
        if(!this.board.isEndOfDeal){
            throw "cannot eval";
        }
        return this.board.history.lastMove.toScore();
    }

    private alpha_beta_search(move: Move, min: number, max: number): number{
        this.board.playMove(move);
        if(this.board.isEndOfDeal){
            let score = this.eval();
            this.board.undo();
            return score;
        }
        let moves = this.board.toThinkingInfo().getPossibleMoves();
        let v: number;
        if(Util.isSameTeam(this.playerNo, this.board.turnPlayer.no)){
            v = min;
            for(let move of moves){
                let t = this.alpha_beta_search(move, v, max);
                if (t > v){
                    v = t;
                }
                if(v > max){
                    this.board.undo();
                    return max;
                }
            }
        }else{
            v = max;
            for(let move of moves){
                let t = this.alpha_beta_search(move, min, v);
                if (t < v){
                    v = t;
                }
                if(v < min){
                    this.board.undo();
                    return min;
                }
            }
        }
        this.board.undo();
        return v;
    }
}