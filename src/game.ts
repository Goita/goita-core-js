import {Define} from './define';
import {Util} from './util';
import {default as Table} from './table';

/** Goita Game Class */
export default class Game{
    public winScore: number;
    public roundCount: number;
    public scores: Array<number>;
    public table: Table;
    public history: Array<Table>;

    public constructor(){
        this.init();
    }
    public init(){
        this.winScore = Define.defaultWinScore;
        this.startNewGame();
    }

    /** set up a new game */
    public startNewGame(){
        this.roundCount = 0;
        this.scores = [0,0,0,0];
        this.history = new Array<Table>();
        this.table = null;
        this.startNewRound();
    }

    /** set up a new table */
    public startNewRound(){
        let dealer;

        if(this.table && this.table.isEndOfDeal){
            this.history.push(this.table);
            dealer = this.table.history.lastMove.no;
        }else{
            dealer = Util.rand.integer(0,3);
        }
        this.table = new Table(dealer);
    }
}