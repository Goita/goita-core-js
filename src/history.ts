import {Koma} from './koma';
import {Define} from './define';
import {Util} from './util';

export class Move{
    describe: string;
    no:number;
    attack:Koma;
    block:Koma;
    pass: boolean;
    faceDown: boolean;
    finish: boolean;
    doubleUp: boolean;

    private constructor(no: number){
        this.no = no;
        this.pass = false;
        this.faceDown = false;
        this.finish = false;
        this.finish = false;
    }

    /** block and attack move */
    public static ofMatch(no: number, blockKoma:Koma, attackKoma:Koma):Move{
        let move = new Move(no);
        move.describe = "Match";
        move.block = blockKoma;
        move.attack = attackKoma;
        move.pass = false;
        move.faceDown = false;
        return move;
    }

    /** face down and attack move */
    public static ofFaceDown(no: number, blockKoma:Koma, attackKoma:Koma):Move{
        let move = Move.ofMatch(no, blockKoma, attackKoma);
        move.describe = "FaceDown";
        move.faceDown = true;
        move.pass = false;
        return move;
    }

    /** pass move */
    public static ofPass(no: number):Move{
        let move = new Move(no);
        move.describe = "Pass";
        move.pass = true;
        return move;
    }

    public static ofFinish(no: number, block:Koma, final:Koma): Move{
        let move = Move.ofMatch(no, block, final);
        move.describe = "Finish";
        move.finish = true;
        return move;
    }

    public static ofDoubleUpFinish(no: number, block:Koma, final:Koma): Move{
        let move = Move.ofFinish(no, block, final);
        move.describe = "x2Finish";
        move.doubleUp = true;
        return move;
    }

    public static fromStr(move: string, attaker?:number): Move{
        let no = Number(move[0]) - 1;
        if(move[1] === Define.pass){
            return Move.ofPass(no);
        }
        if(attaker !== undefined && no === attaker){
            return Move.ofFaceDown(no, Koma.fromStr( move[1]), Koma.fromStr( move[2]));
        }
        return Move.ofMatch(no, Koma.fromStr( move[1]), Koma.fromStr( move[2]));
    }

    public toString():string{
        if(this.pass){return (this.no+1) + Define.pass;}
        return (this.no+1) + (this.faceDown ? Define.hidden : this.block.value) + this.attack.value;
    }

    public toOpenString():string{
        if(this.pass){return (this.no+1) + Define.pass;}
        return (this.no+1) + this.block.value + this.attack.value;
    }
}

export class BoardHistory{
    public moveStack : Array<Move>;
    public tegomas : Array<string>;
    public attackerLog: Array<number>;
    public turn: number;
    public dealer:number;

    public constructor(dealer: number, tegomas: Array<string>){
        this.init(dealer, tegomas);
    }

    private init(dealer: number, tegomas: Array<string>){
        this.moveStack = new Array<Move>();
        this.tegomas = tegomas;
        this.attackerLog = new Array<number>();
        this.attackerLog.push(dealer);
        this.turn = dealer;
        this.dealer = dealer;
    }

    public get lastMove():Move{
        return this.moveStack[this.moveStack.length-1];
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
        this.turn = Util.getNextTurn(move.no);
    }

    public pop(): Move{
        let move = this.moveStack.pop();
        if(!move.pass){
            this.attackerLog.pop();
        }
        this.turn = Util.getPreviousTurn(move.no);
        return move;
    }

    public static fromString(history: string): BoardHistory{
        let historyArray = history.split(Define.historyStringDelimiter);

        let tegomas = new Array<string>();
        for(let i=0;i<Define.maxPlayers;i++){
            tegomas.push(historyArray[i]);
        }

        let dealer = Number(historyArray[Define.maxPlayers].substring(1,2))-1;
        if( dealer<0 || Define.maxPlayers <= dealer){
            throw "Dealer No. out of range: the given value was " + dealer;
        }
        let moves = BoardHistory.parseMoveHistory(historyArray.slice(Define.maxPlayers + 1));

        let boardHistory = new BoardHistory(dealer, tegomas);

        for(let move of moves){
            boardHistory.push(move);
        }
        return boardHistory;
    }

    public static parseMoveHistory(moveHistory: Array<string>): Array<Move>{
        let moves = new Array<Move>();

        if(!moveHistory || moveHistory.length === 0){
            return moves;
        }
        let attacker: number = Number(moveHistory[0].charAt(0)) - 1;

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
        str.push(Define.dealerChar + (this.dealer+1));
        for(let move of this.moveStack){
            str.push(move.toOpenString());
        }
        return str.join(Define.historyStringDelimiter);
    }
}