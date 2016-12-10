import * as Define from './define';
import * as Koma from './koma';
import { default as Player } from "./player";
import PlayMemo from './playmemo';
import History from './history';

export default class Table{
    players: Array<Player>;
    currentPlayer: number;
    history: History;

    constructor(){
        this.players = new Array<Player>();
        for(let i =0; i<Define.MAX_PLAYERS;i++){
            this.players[i] = new Player(i);
        }
    }

    play = (blockKoma:string, attackKoma:string, playablecheck?:boolean): void =>{
        if(playablecheck){
            if(!this.canPlay(blockKoma, attackKoma)){
                throw "cannot play a given koma";
            }
        }
        
        let player = this.players[this.currentPlayer];
        let memo = PlayMemo.Match(this.currentPlayer, blockKoma, attackKoma);
        player.putKoma(blockKoma);
        player.putKoma(attackKoma);

    }

    canPlay = (block: string, attack: string): boolean=>{
        //[ATTENTION] if block and attack are the same, must count koma left

        return true;
    }

    canBlock = (playerNo:number, blockKoma:string): boolean=>{
        return true;
    }

    canAttack = (playerNo:number, attackKoma:string): boolean=>{
        return true;
    }
}
