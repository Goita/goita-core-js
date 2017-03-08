import { Yaku } from "./define";
import { Util } from "./util";
import { KomaArray, Koma } from './koma';
import { Player } from './player';
import { Define } from "./index";

/** Yaku information */
export class YakuInfo {
    private _playerNo: number;
    private _yaku: Yaku;

    public constructor(no: number, yaku: Yaku){
        this._playerNo = no;
        this._yaku = yaku;
    }

    public get playerNo():number{
        return this._playerNo;
    }

    public get yaku(): Yaku {
        return this._yaku;
    }

    public static from(hands: string[] | Player[]): YakuInfo[]{
        const yakuinfo = new Array<YakuInfo>();
        for (let i=0;i<Define.maxPlayers;i++) {
            const h = hands[i];
            const shiCount = h instanceof Player ? h.countKoma(Koma.shi) : KomaArray.count(KomaArray.createFrom(h),Koma.shi);
            if(shiCount < 5) {
                continue;
            } else if(shiCount === 5) {
                if(yakuinfo.length > 0) {
                    // goshi & goshi case
                    let ggYaku: Yaku;
                    if(Util.isSameTeam(i, yakuinfo[0].playerNo)){
                        ggYaku = Yaku.goshigoshi_win;
                    } else {
                        ggYaku = Yaku.goshigoshi_opposite;
                    }
                    yakuinfo[0] = new YakuInfo(yakuinfo[0].playerNo, ggYaku);
                    yakuinfo.push(new YakuInfo(i, ggYaku));
                } else {
                    // goshi
                    yakuinfo.push(new YakuInfo(i, Yaku.goshi));
                }
            } else if (shiCount === 6) {
                yakuinfo.push(new YakuInfo(i, Yaku.rokushi));
            }else if (shiCount === 7) {
                yakuinfo.push(new YakuInfo(i, Yaku.nanashi));
            }else if (shiCount === 8) {
                yakuinfo.push(new YakuInfo(i, Yaku.hachishi));
            } else {
                throw new Error("Unexpected Shi count or Yaku information");
            }
        }
        return yakuinfo;
    }
}
