import {Move} from './history';

/** Goita AI class interface */
export interface AI{
    chooseMove(boardHistory: string): Move;
    evalMoves(boardHistory: string): Array<EvaluatedMove>;
}

/** AI's evaluation result */
export class EvaluatedMove{
    public score: number;
    public move: Move;
}