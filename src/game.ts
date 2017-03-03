import {Define} from './define';
import {Util} from './util';
import {Board} from './board';

/** Goita Game Class */
export class Game{
    public winScore: number;
    public roundCount: number;
    public scores: Array<number>;
    public board: Board;
    public history: Array<Board>;

    public constructor(){
        this.init();
    }

    private init(){
        this.winScore = Define.defaultWinScore;
        this.scores = [0,0,0,0];
    }

    /** set up a new game */
    public startNewGame(){
        this.roundCount = 0;
        this.scores = [0,0,0,0];
        this.history = new Array<Board>();
        this.board = null;
    }

    /** set up a new board */
    public startNewDeal(){
        let dealer: number;

        if(this.board && this.board.isEndOfDeal){
            this.history.push(this.board);
            dealer = this.board.getFinishState().nextDealerNo;
        }else{
            dealer = Util.rand.integer(0,3);
        }
        this.board = Board.createRandomly(dealer);
        this.setupNewDeal();
    }

    /** set up a new board with history string */
    public startNewDealWithInitialState(history:string){
        if(this.board && this.board.isEndOfDeal){
            this.history.push(this.board);
        }
        this.board = Board.createFromString(history);
        this.setupNewDeal();
    }

    private setupNewDeal(): void{
        this.roundCount = 1;

        this.scores = [0, 0];
        for(const h of this.history){
            if(h.isEndOfDeal){
                const f = h.getFinishState();
                if(f.redeal || f.aborted){
                    continue;
                }
                const m = h.history.lastMove;
                this.scores[m.no % 2] += m.toScore();
                this.roundCount++;
            }
        }
    }

    public get isEnd(): boolean{
        for(const s of this.scores){
            if(s >= this.winScore){
                return true;
            }
        }
        return false;
    }
}