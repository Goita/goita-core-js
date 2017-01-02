import {Define} from './define';
import {Koma} from './koma';
import { default as Player } from './player';
import {Move, TableHistory} from './history';
import {Util} from './util';

/** Goita Table Class */
export default class Table{
    public players: Array<Player>;
    public history: TableHistory;
    private redoStack: Array<Move>;
    private kingUsed: number;
    public onFinished: (lastMove:Move)=>void;

    public constructor(dealer: number){
        this.init(dealer);
    }
    public get isEndOfDeal(): boolean{
        return this.history.lastMove && this.history.lastMove.finish;
    }
    public get currentPlayer(): Player{
        return this.players[this.history.turn];
    }

    public init(dealer: number): void{
        this.kingUsed = 0;
        this.redoStack = new Array<Move>();
        let tegomas = Util.dealTegomas();
        this.history = new TableHistory(dealer, tegomas);
        this.players = new Array<Player>();
        for(let i =0; i<Define.maxPlayers;i++){
            this.players[i] = new Player(i, tegomas[i]);
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

        if(this.isEndOfDeal && this.onFinished){
            this.onFinished(this.history.lastMove);
        }
    }

    public get canUndo():boolean{
        return this.history.moveStack.length > 0;
    }

    /** undo the latest move */
    undo(): void{
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

    public get canRedo():boolean{
        return this.redoStack.length > 0;
    }

    redo():void{
        let move = this.redoStack.pop();
        if(move){
            this.playMove(move);
        }
    }

    private createCurrentPlayersMove(block: Koma, attack: Koma): Move{
        let move: Move;

        if(this.currentPlayer.handCounter <= 2){
            if(this.currentPlayer.no === this.history.lastAttacker){
                move = Move.ofDoubleUpFinish(this.currentPlayer.no, block, attack);
            }else{
                move = Move.ofFinish(this.currentPlayer.no, block, attack);
            }
        }
        else{
            if(this.currentPlayer.no === this.history.lastAttacker){
                move = Move.ofFaceDown(this.currentPlayer.no, block, attack);
            }else{
                move = Move.ofMatch(this.currentPlayer.no, block, attack);
            }
        }
        return move;
    }

    canPlay(block: Koma, attack: Koma): boolean{
        if(this.isEndOfDeal){
            return false;
        }

        let move = this.createCurrentPlayersMove(block, attack);
        return this.canPlayMove(move);
    }

    canPlayMove(move: Move):boolean{
        if(move.faceDown && this.currentPlayer.no !== this.history.lastAttacker){
            //cannot play face down move, because I am not the last attacker
            return false;
        }

        if(!move.faceDown && this.currentPlayer.no === this.history.lastAttacker){
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
}
