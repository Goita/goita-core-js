import {Move} from './history';
import {ThinkingInfo} from './thinkinginfo';

/** Goita AI class interface */
export interface AI{
    chooseMove(info: ThinkingInfo): Move;
    evalMoves(info: ThinkingInfo): Array<EvaluatedMove>;
}

/** AI's evaluation result */
export class EvaluatedMove{
    public score: number;
    public move: Move;
    public history: string;
    public constructor(move: Move, score: number, history:string = null){
        this.move = move;
        this.score = score;
        this.history = history;
    }
}