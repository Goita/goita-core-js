import { Koma, KomaArray } from './koma';
import { Move } from './history';
import { YakuInfo } from "./yaku";
import { Yaku } from "./define";

/** the board infomation whitch player think with*/
export class ThinkingInfo {
    /** my hand */
    public hand: string;
    /** the fields which every player see */
    public fields: string[];
    /** all opened koma on my field */
    public hiddenField: string;
    /** the last attack information */
    public lastAttack: Move;
    /** turn No. */
    public turn: number;

    /** dealer No. */
    public dealer: number;
    /** true if Ou or Gyoku is used */
    public kingUsed: boolean;
    /** goshi information */
    public yakuInfo: YakuInfo[];

    /** moves history */
    public history: string;

    public constructor(turn: number, dealer:number, hand: string, fields: string[], hidden: string, lastAttack: Move, yakuInfo: YakuInfo[], history: string) {
        this.turn = turn;
        this.dealer = dealer;
        this.hand = hand;
        this.fields = fields;
        this.hiddenField = hidden;
        this.lastAttack = lastAttack;
        this.kingUsed = fields.some(f => KomaArray.contains(KomaArray.createFrom(f), Koma.ou));
        this.yakuInfo = yakuInfo;
        this.history = history;
    }

    public getPossibleMoves(): Array<Move> {
        let moves = new Array<Move>();

        // no possible moves with finishing yaku
        if(this.yakuInfo.some((i)=>i.yaku === Yaku.rokushi || i.yaku === Yaku.nanashi || i.yaku === Yaku.hachishi || i.yaku === Yaku.goshigoshi_win)) {
            return moves;
        }
        if (this.lastAttack && this.lastAttack.finish) {
            return moves;
        }
        const hand = KomaArray.createFrom(this.hand);
        const myfield = KomaArray.createFrom(this.fields[this.turn]);

        if (!this.lastAttack || this.turn === this.lastAttack.no) {
            //The last attack passed all the others
            for (let faceDown of KomaArray.getUnique(hand)) {
                for (let attack of KomaArray.getUnique(hand)) {
                    if (faceDown.equalsExact(attack)) {
                        if (KomaArray.countExact(hand, faceDown) < 2) {
                            continue;
                        }
                    }
                    if (KomaArray.getLength(myfield) < 6) {
                        if (attack.isKing) {
                            if (KomaArray.count(hand, Koma.ou) < 2 && !this.kingUsed) {
                                continue;
                            }
                        }
                        moves.push(Move.ofFaceDown(this.turn, faceDown, attack));
                    } else {
                        if (faceDown.equals(attack)) {
                            moves.push(Move.ofDoubleUpFinish(this.turn, faceDown, attack));
                        } else {
                            moves.push(Move.ofFinish(this.turn, faceDown, attack));
                        }
                    }
                }
            }
        } else {
            //The other player's attack
            moves.push(Move.ofPass(this.turn));
            if (KomaArray.contains(hand, this.lastAttack.attack)) {
                let block = this.lastAttack.attack;
                for (let attack of KomaArray.getUnique(hand)) {
                    if (block.equals(attack) && KomaArray.count(hand, attack) < 2) {
                        continue;
                    }

                    if (KomaArray.getLength(myfield) < 6) {
                        if (attack.isKing) {
                            if (KomaArray.count(hand, Koma.ou) < 2 && !this.kingUsed) {
                                continue;
                            }
                        }
                        moves.push(Move.ofMatch(this.turn, block, attack));
                    } else {
                        if (block.equals(attack)) {
                            moves.push(Move.ofDoubleUpFinish(this.turn, block, attack));
                        } else {
                            moves.push(Move.ofFinish(this.turn, block, attack));
                        }
                    }
                }
            }
            if (KomaArray.contains(hand, Koma.ou) && Koma.ou.canBlock(this.lastAttack.attack)) {
                for (let attack of KomaArray.getUnique(hand)) {
                    if (attack.isKing && KomaArray.count(hand, Koma.ou) < 2) {
                        continue;
                    }
                    if (KomaArray.getLength(myfield) < 6) {
                        if (attack.isKing) {
                            moves.push(Move.ofMatch(this.turn, Koma.ou, Koma.gyoku));
                            moves.push(Move.ofMatch(this.turn, Koma.gyoku, Koma.ou));
                        } else {
                            if (KomaArray.containsExact(hand, Koma.ou)) {
                                moves.push(Move.ofMatch(this.turn, Koma.ou, attack));
                            }
                            else {
                                moves.push(Move.ofMatch(this.turn, Koma.gyoku, attack));
                            }
                        }
                    } else {
                        if (attack.isKing) {
                            moves.push(Move.ofDoubleUpFinish(this.turn, Koma.ou, Koma.gyoku));
                            moves.push(Move.ofDoubleUpFinish(this.turn, Koma.gyoku, Koma.ou));
                        } else {
                            if (KomaArray.containsExact(hand, Koma.ou)) {
                                moves.push(Move.ofFinish(this.turn, Koma.ou, attack));
                            }
                            else {
                                moves.push(Move.ofFinish(this.turn, Koma.gyoku, attack));
                            }
                        }
                    }
                }
            }
        }
        return moves;
    }

    public getBlockKomaList(): Array<Koma> {
        const moves = this.getPossibleMoves();
        const blocks = KomaArray.getUnique(moves.filter((m) => !m.pass).map<Koma>((m) => m.block));
        return blocks;
    }

    public getAttackKomaList(block: Koma): Array<Koma> {
        const moves = this.getPossibleMoves();
        const attacks = moves.filter((m) => !m.pass && m.block === block).map<Koma>((m) => m.attack);
        if (attacks.length === 0) {
            throw new Error("invalid block koma " + block.toString() + " is given");
        }
        return attacks;
    }

    public get canPass(): boolean {
        return this.lastAttack && this.lastAttack.no !== this.turn;
    }
}
