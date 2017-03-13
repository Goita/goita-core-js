import { Yaku } from "./define";
import { Util } from "./util";
import { KomaArray, Koma } from './koma';
import { Player } from './player';
import { Define } from "./index";

/** Yaku information */
export class YakuInfo {
    private _playerNo: number;
    private _yaku: Yaku;
    private _score: number;

    public constructor(no: number, yaku: Yaku, score: number){
        this._playerNo = no;
        this._yaku = yaku;
        this._score = score;
    }

    public get playerNo():number{
        return this._playerNo;
    }

    public get yaku(): Yaku {
        return this._yaku;
    }

    public get isFinishingPlay(): boolean{
        if(this._yaku === Yaku.goshi || this._yaku === Yaku.goshigoshi_opposite){
            return false;
        }
        return true;
    }

    public get score():number{
        return this._score;
    }

    public static from(hands: string[] | Player[]): YakuInfo[]{
        const yakuinfo = new Array<YakuInfo>();
        for (let i=0;i<(Define.maxPlayers|0);i = (i+1)|0) {
            const h = hands[i];
            const shiCount = h instanceof Player ? h.countKoma(Koma.shi) : KomaArray.count(KomaArray.createFrom(h),Koma.shi);
            const hand = h instanceof Player ? h.hand : KomaArray.createFrom(h);
            if(shiCount < 5) {
                continue;
            } else if(shiCount === 5) {
                if(yakuinfo.length > 0) {
                    // goshi & goshi case
                    let ggYaku: Yaku;
                    let s: number;
                    if(Util.isSameTeam(i, yakuinfo[0].playerNo)){
                        ggYaku = Yaku.goshigoshi_win;
                        s = Define.defaultWinScore;
                    } else {
                        ggYaku = Yaku.goshigoshi_opposite;
                        s = 0;
                    }
                    yakuinfo[0] = new YakuInfo(yakuinfo[0].playerNo, ggYaku, s/2);
                    yakuinfo.push(new YakuInfo(i, ggYaku, s/2));
                } else {
                    // goshi
                    yakuinfo.push(new YakuInfo(i, Yaku.goshi, 0));
                }
            } else if (shiCount === 6) {
                KomaArray.sortDesc(hand);
                const finishKoma = hand[0];
                const n = KomaArray.count(hand, finishKoma);
                yakuinfo.push(new YakuInfo(i, Yaku.rokushi, finishKoma.score * n));

            }else if (shiCount === 7) {
                KomaArray.sortDesc(hand);
                const finishKoma = hand[0];
                yakuinfo.push(new YakuInfo(i, Yaku.nanashi, finishKoma.score));

            }else if (shiCount === 8) {
                yakuinfo.push(new YakuInfo(i, Yaku.hachishi, 100));

            } else {
                throw new Error("Unexpected Shi count or Yaku information");
            }
        }
        return yakuinfo;
    }
}
