import { Board } from "./board";
import { Yaku } from "./define";

export class DealOptions {
    /** suppress goshi, goshigoshi_opposite */
    public noGoshi: boolean;
    /** suppress rokushi, nanashi, hachishi, goshigoshi_win */
    public noYaku: boolean;

    public constructor(){
        this.noGoshi = false;
        this.noYaku = false;
    }

    public areValid(board: Board): boolean{
        const info = board.yakuInfo;
        if(this.noGoshi){
            if(info.length > 0 && (info[0].yaku === Yaku.goshi || info[0].yaku === Yaku.goshigoshi_opposite)){
                return false;
            }
        }
        if(this.noYaku){
            if(info.length > 0 && info[0].isFinishingPlay){
                return false;
            }
        }
        return true;
    }
}