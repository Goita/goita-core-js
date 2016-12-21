import {Define} from './define';
import {Koma} from './koma';
import { default as Player } from './player';
import {Move, TableHistory} from './history';
import {Util} from './util';


export default class Table{
    public players: Array<Player>;
    public history: TableHistory;
    public redoStack: Array<Move>;
    private kingUsed: number;

    public constructor(dealer: number){
        this.init(dealer);
    }

    public get currentPlayer(): number{
        return this.history.turn;
    }

    init(dealer: number): void{
        this.kingUsed = 0;
        this.redoStack = new Array<Move>();
        this.history = new TableHistory(dealer, Util.dealTegomas());
        this.players = new Array<Player>();
        for(let i =0; i<Define.maxPlayers;i++){
            this.players[i] = new Player(i);
        }
    }

    play(block:Koma, attack:Koma, playablecheck:boolean = false): void{
        if(playablecheck){
            if(!this.canPlay(block, attack)){
                throw "cannot play a given koma";
            }
        }

        let move = this.createCurrentPlayersMove(block, attack);
        this.playMove(move);
    }

    playMove(move: Move):void{
        this.history.push(move);

        let player = this.players[move.no];
        player.putKoma(move.block, move.faceDown);
        player.putKoma(move.attack);
        if( (move.block.isKing && !move.faceDown)){
            this.kingUsed++;
        }
        if(move.attack.isKing){
            this.kingUsed++;
        }
    }

    /** undo the latest move */
    undo(): void{
        let move = this.history.pop();
        this.redoStack.push(move);
        if( (move.block.isKing && !move.faceDown)){
            this.kingUsed--;
        }
        if(move.attack.isKing){
            this.kingUsed--;
        }
    }

    redo():void{
        let move = this.redoStack.pop();
        if(move){
            this.playMove(move);
        }
    }

    private createCurrentPlayersMove(block: Koma, attack: Koma): Move{
        let move: Move;
        if(this.currentPlayer === this.history.lastAttacker){
            move = Move.ofFaceDown(this.currentPlayer, block, attack);
        }else{
            move = Move.ofMatch(this.currentPlayer, block, attack);
        }
        return move;
    }

    canPlay(block: Koma, attack: Koma): boolean{
        let move = this.createCurrentPlayersMove(block, attack);
        return this.canPlayMove(move);
    }

    canPlayMove(move: Move):boolean{
        if(move.faceDown && this.currentPlayer !== this.history.lastAttacker){
            //cannot play face down move, because I am not the last attacker
            return false;
        }

        if(!move.faceDown && this.currentPlayer === this.history.lastAttacker){
            //must play face down move, because I am the last attaker
            return false;
        }

        if(!move.faceDown && !move.block.canBlock(this.history.lastAttackMove.attack)){
            return false;
        }

        //if block and attack are the same, must count koma left
        let counting = 1;
        if(move.block.equals(move.attack)){
            counting = 2;
        }
        let player = this.players[this.history.turn];
        let inHand = player.countKoma(move.block) >= counting && player.countKoma(move.attack) > 0;
        let canUseKing = move.attack.isKing && (this.kingUsed > 0 || player.countKoma(Koma.ou) >= 2);
        return inHand && canUseKing;
    }

    getPossibleMoves(): Array<Move>{
        let moves = new Array<Move>();
        return moves;
    }

    /** resume from history string */
    public resume(historyStr:string):void{
        let history = TableHistory.fromString(historyStr);
        this.init(history.moveStack[0].no);
        while(history.moveStack.length > 0){
            this.redoStack.push(history.pop());
        }

        while(this.redoStack.length > 0){
            this.redo();
        }
    }

    /** back 1 move on this history */
    public back():void{

    }
    /** forward 1 move on this history */
    public next():void{

    }
}
