import {Define} from './define';
import {Koma} from './koma';
import { default as Player } from './player';
import {Move, BoardHistory} from './history';
import {Util} from './util';

/** Goita Board Class */
export default class Board{
    public players: Array<Player>;
    public history: BoardHistory;
    private redoStack: Array<Move>;
    private kingUsed: number;
    public onFinished: (lastMove:Move)=>void;

    private constructor(){
    }
    public get isEndOfDeal(): boolean{
        return this.history.lastMove && this.history.lastMove.finish;
    }
    public get currentPlayer(): Player{
        return this.players[this.history.turn];
    }

    private init(dealer: number, tegomas: Array<string>): void{
        this.kingUsed = 0;
        this.redoStack = new Array<Move>();
        this.history = new BoardHistory(dealer, tegomas);
        this.players = new Array<Player>();
        for(let i =0; i<Define.maxPlayers;i++){
            this.players[i] = new Player(i, tegomas[i]);
        }
    }

    public play(block:Koma, attack:Koma, playablecheck:boolean = false): void{
        if(playablecheck){
            if(!this.canPlay(block, attack)){
                console.log("cannot play komas. block:" + block.value + " attack: " + attack.value);
                throw "cannot play given komas";
            }
        }

        let move = this.createCurrentPlayersMove(block, attack);
        this.playMove(move);
    }

    public pass(playablecheck:boolean = false):void{
        if(playablecheck){
            if(!this.canPass()){
                throw "cannot pass";
            }
        }
        let move = Move.ofPass(this.currentPlayer.no);
        this.playMove(move);
    }

    public playMove(move: Move):void{
        this.history.push(move);
        if(move.pass){
            return;
        }
        let player = this.players[move.no];
        player.putKoma(move.block, move.faceDown);
        player.putKoma(move.attack);
        if( (move.block.isKing && !move.faceDown)){
            this.kingUsed++;
        }
        if(move.attack.isKing){
            this.kingUsed++;
        }

        if(this.isEndOfDeal && this.onFinished){
            this.onFinished(this.history.lastMove);
        }
    }

    private createCurrentPlayersMove(block: Koma, attack: Koma): Move{
        if(this.currentPlayer.handCounter <= 2){
            if(this.currentPlayer.no === this.history.lastAttacker){
                return Move.ofDoubleUpFinish(this.currentPlayer.no, block, attack);
            }else{
                return Move.ofFinish(this.currentPlayer.no, block, attack);
            }
        }
        else{
            if(this.currentPlayer.no === this.history.lastAttacker){
                return Move.ofFaceDown(this.currentPlayer.no, block, attack);
            }else{
                return Move.ofMatch(this.currentPlayer.no, block, attack);
            }
        }
    }

    public canPlay(block: Koma, attack: Koma): boolean{
        if(this.isEndOfDeal){
            return false;
        }

        let move = this.createCurrentPlayersMove(block, attack);
        return this.canPlayMove(move);
    }

    public canPass(): boolean{
        if(this.isEndOfDeal){
            return false;
        }
        let passMove = Move.ofPass(this.currentPlayer.no);
        return this.canPlayMove(passMove);
    }

    public canPlayMove(move: Move):boolean{
        if(move.pass){
            return this.currentPlayer.no !== this.history.lastAttacker;
        }

        if(move.faceDown && this.currentPlayer.no !== this.history.lastAttacker){
            console.log("REASON: cannot play face down move, because I am not the last attacker");
            return false;
        }

        if(!move.faceDown && this.currentPlayer.no === this.history.lastAttacker){
            console.log("REASON: must play face down move, because I am the last attaker");
            return false;
        }

        if(!move.faceDown && !move.block.canBlock(this.history.lastAttackMove.attack)){
            console.log("REASON: cannot match to the last attack");
            return false;
        }

        //if block and attack are the same, must count koma left
        let counting = 1;
        if(move.block.equals(move.attack)){
            counting = 2;
        }
        let player = this.players[this.history.turn];
        let inHand = player.countKoma(move.block) >= counting && player.countKoma(move.attack) > 0;

        //king check
        if(move.attack.isKing){
            let canUseKing = (this.kingUsed > 0 || player.countKoma(Koma.ou)>=2);
            return inHand && canUseKing;
        }
        return inHand;
    }

    public canUndo():boolean{
        return this.history.moveStack.length > 0;
    }

    /** undo the latest move */
    public undo(): void{
        let move = this.history.pop();
        this.redoStack.push(move);
        let player = this.players[move.no];
        player.pickLastKoma();
        player.pickLastKoma();
        if( (move.block.isKing && !move.faceDown)){
            this.kingUsed--;
        }
        if(move.attack.isKing){
            this.kingUsed--;
        }
    }

    public canRedo():boolean{
        return this.redoStack.length > 0;
    }

    public redo():void{
        let move = this.redoStack.pop();
        if(move){
            this.playMove(move);
        }
    }

    public getPossibleMoves(): Array<Move>{
        let moves = new Array<Move>();
        let player = this.currentPlayer;
        if(player.no === this.history.lastAttacker){
            //The last attack passed all the others
            for(let faceDown of player.getUniqueHand()){
                for(let attack of player.getUniqueHand()){
                    if(faceDown.equals(attack)){
                        if(player.countKoma(faceDown) < 2){
                            continue;
                        }
                    }
                    if(attack.isKing){
                        if(player.countKoma(Koma.ou) < 2 && this.kingUsed === 0){
                            continue;
                        }
                    }
                    moves.push(Move.ofFaceDown(player.no, faceDown, attack));
                }
            }
        }else{
            //The other player's attack
            moves.push(Move.ofPass(player.no));
            let lastAttack = this.history.lastAttackMove.attack;
            if(player.hasKoma(lastAttack)){
                for(let attack of player.getUniqueHand()){
                    if(lastAttack.equals(attack) && player.countKoma(attack) < 2){
                        continue;
                    }
                    if(attack.isKing){
                        if(player.countKoma(Koma.ou) < 2 && this.kingUsed === 0){
                            continue;
                        }
                    }
                    moves.push(Move.ofMatch(player.no, lastAttack, attack));
                }
            }
            if(player.hasKoma(Koma.ou) && Koma.ou.canBlock(lastAttack)){
                for(let attack of player.getUniqueHand()){
                    if(attack.isKing && player.countKoma(Koma.ou) < 2){
                        continue;
                    }
                    if(attack.isKing){
                        moves.push(Move.ofMatch(player.no, Koma.ou, Koma.gyoku));
                        moves.push(Move.ofMatch(player.no, Koma.gyoku, Koma.ou));
                    }else{
                        if(player.hasKomaExact(Koma.ou)){
                            moves.push(Move.ofMatch(player.no, Koma.ou, attack));
                        }
                        else{
                            moves.push(Move.ofMatch(player.no, Koma.gyoku, attack));
                        }
                    }
                }
            }
        }
        return moves;
    }

    public static createRandomly(dealer: number):Board{
        let board = new Board();
        let tegomas = Util.dealTegomas();
        board.init(dealer, tegomas);
        return board;
    }

    /** create from history string */
    public static createFromString(historyStr:string):Board{
        let history = BoardHistory.fromString(historyStr);
        let table = new Board();
        table.init(history.dealer, history.tegomas);
        while(history.moveStack.length > 0){
            table.redoStack.push(history.pop());
        }

        return table;
    }

    /** table to history string */
    public toHistoryString():string{
        return this.history.toString();
    }
}
