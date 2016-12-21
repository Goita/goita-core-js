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
    public static ofMatch(no: number, blockKoma:Koma, attackKoma:Koma):Move{
        let move = new Move(no);
        move.block = blockKoma;
        move.attack = attackKoma;
        move.pass = false;
        move.faceDown = false;
        return move;
    }

    /** face down and attack move */
    public static ofFaceDown(no: number, blockKoma:Koma, attackKoma:Koma):Move{
        let move = Move.ofMatch(no, blockKoma, attackKoma);
        move.faceDown = true;
        return move;
    }

    /** pass move */
    public static ofPass(no: number):Move{
        let move = new Move(no);
        move.pass = true;
        return move;
    }

    public static fromStr(move: string, attaker?:number): Move{
        let no = Number(move[0]);
        if(move[1] === Define.pass){
            return Move.ofPass(no);
        }
        if(attaker && no === attaker){
            return Move.ofFaceDown(no, Koma.fromStr( move[1]), Koma.fromStr( move[2]));
        }
        return Move.ofMatch(no, Koma.fromStr( move[1]), Koma.fromStr( move[2]));
    }

    public toString():string{
        if(this.pass){return this.no + Define.pass;}
        return this.no + (this.faceDown ? Define.hidden : this.block.value) + this.attack.value;
    }

    public toOpenString():string{
        if(this.pass){return this.no + Define.pass;}
        return this.no + this.block.value + this.attack.value;
    }
}

export class TableHistory{
    public moveStack : Array<Move>;
    public tegomas : Array<string>;
    public attackerLog: Array<number>;
    public turn: number;

    public constructor(dealer: number, tegomas: Array<string>){
        this.init(dealer, tegomas);
    }

    private init(dealer: number, tegomas: Array<string>){
        this.moveStack = new Array<Move>();
        this.tegomas = tegomas;
        this.attackerLog = new Array<number>();
        this.attackerLog.push(dealer);
        this.turn = dealer;
    }

    public get lastAttacker():number{
        return this.attackerLog[this.attackerLog.length - 1];
    }

    public get lastAttackMove():Move{
        for(let i=this.moveStack.length-1;i>=0; i--){
            let m = this.moveStack[i];
            if(!m.pass){
                return m;
            }
        }
        return null;
    }

    public push(move: Move){
        this.moveStack.push(move);
        if(!move.pass){
            this.attackerLog.push(move.no);
        }
        this.turn = (move.no) % 4 + 1;
    }

    public pop(): Move{
        let move = this.moveStack.pop();
        if(!move.pass){
            this.attackerLog.pop();
        }
        this.turn = (move.no + 2) % 4 + 1;
        return move;
    }

    public static fromString(history: string): TableHistory{
        let historyArray = history.split(Define.historyStringDelimiter);

        let tegomas = new Array<string>();
        for(let i=0;i<Define.maxPlayers;i++){
            tegomas.push(historyArray[i]);
        }

        let moves = TableHistory.parseMoveHistory(historyArray.slice(Define.maxPlayers));
        let dealer = moves[0].no;
        let tableHistory = new TableHistory(dealer, tegomas);

        for(let move of moves){
            tableHistory.push(move);
        }
        return tableHistory;
    }

    public static parseMoveHistory(moveHistory: Array<string>): Array<Move>{
        let moves = new Array<Move>();

        if(!moveHistory || moveHistory.length === 0){
            throw "there is no parsing history";
        }
        let attacker: number = Number(moveHistory[0].charAt(0));

        for(let m of moveHistory){
            let move = Move.fromStr(m, attacker);
            moves.push(move);
            if(!move.pass){
                attacker = move.no;
            }
        }
        return moves;
    }

    public toString(): string{
        let str = new Array<string>();
        for(let i=0;i<Define.maxPlayers;i++){
            str.push(this.tegomas[i]);
        }
        for(let move of this.moveStack){
            str.push(move.toOpenString());
        }
        return str.join(Define.historyStringDelimiter);
    }
}

export class GameHistory extends Array<TableHistory>{
    //
}