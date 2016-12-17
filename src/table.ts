import {Define} from './define';
import {Koma} from './koma';
import { default as Player } from './player';
import {Move, TableHistory} from './history';
import {Util} from './util';


export default class Table{
    players: Array<Player>;
    currentPlayer: number;
    private _history: TableHistory;
    private _historyIndex: number; //history stack index

    constructor(){
        this.init();
    }

    init(): void{
        this._historyIndex = 0;
        this._history = new TableHistory(Util.dealTegomas());
        this.players = new Array<Player>();
        for(let i =0; i<Define.MAX_PLAYERS;i++){
            this.players[i] = new Player(i);
        }
    }

    play(blockKoma:Koma, attackKoma:Koma, playablecheck?:boolean): void{
        if(playablecheck){
            if(!this.canPlay(blockKoma, attackKoma)){
                throw "cannot play a given koma";
            }
        }
        
        let player = this.players[this.currentPlayer];
        let move = Move.ofMatch(this.currentPlayer, blockKoma, attackKoma);
        //player.putKoma(blockKoma);
        //player.putKoma(attackKoma);
    }

    /** undo the latest move */
    undo(): void{

    }

    canPlay(block: Koma, attack: Koma): boolean{
        //[ATTENTION] if block and attack are the same, must count koma left
        
        return true;
    }

    /** resume from history string */
    public resume(historyStr:string):void{
        this.init();


    }

    /** back 1 move on this history */
    public back():void{

    }
    /** forward 1 move on this history */
    public next():void{

    }
}
