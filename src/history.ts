import {Koma} from './koma';
import {Define} from './define';

export class Move{
    no:number;
    attack:Koma;
    block:Koma;
    pass: boolean;
    faceDown: boolean;

    private constructor(no: number){
        this.no = no;
        this.pass = false;
        this.faceDown = false;
    }

    /** block and attack move */
    static ofMatch(no: number, blockKoma:Koma, attackKoma:Koma):Move{
        let move = new Move(no);
        move.block = blockKoma;
        move.attack = attackKoma;
        move.pass = false;
        move.faceDown = false;
        return move;
    }

    /** face down and attack move */
    static ofFaceDown(no: number, blockKoma:Koma, attackKoma:Koma):Move{
        let move = Move.ofMatch(no, blockKoma, attackKoma);
        move.faceDown = true;
        return move;
    }

    /** pass move */
    static ofPass(no: number):Move{
        let move = new Move(no);
        move.pass = true;
        return move;
    }

    public toString():string{
        if(this.pass){return Define.PASS;}
        return (this.faceDown ? Define.HIDDEN : this.block.Value) + this.attack.Value;
    }
}
export class TableHistory{
    private _history : Array<Move>;
    private _tegomas : Array<string>;
    
    public constructor(tegomas: Array<string>){
        this._history = new Array<Move>();
        this._tegomas = tegomas;
    }

    public push(move: Move){
        this._history.push(move);
    }

    public pop(): Move{
        let move = this._history.pop();
        return move;
    }

    public fromString(history: string): void{
        
    }

    public toString(): string{
        let str:string = ""; 
        for(let i=0;i<Define.MAX_PLAYERS;i++){
            str += this._tegomas[i];
        }
        for(let move of this._history){
            str += move.toString();
        }
        return str;
    }
}

export class GameHistory extends Array<TableHistory>{
    //
}