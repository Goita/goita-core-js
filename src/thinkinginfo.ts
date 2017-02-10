import {Koma, KomaArray} from './koma';
import {Move} from './history';

/** the board infomation whitch player think with*/
export class ThinkingInfo{
    public hand: string;
    public fields: string[];
    public lastAttack: Move;
    public turn: number;
    public kingUsed: boolean;

    public constructor(turn: number, hand: string, fields: string[], lastAttack: Move){
        this.turn = turn;
        this.hand = hand;
        this.fields = fields;
        this.lastAttack = lastAttack;
        this.kingUsed = fields.some(f=> KomaArray.contains(KomaArray.createFrom(f), Koma.ou));
    }

    public getPossibleMoves(): Array<Move>{
        let moves = new Array<Move>();
        let hand = KomaArray.createFrom(this.hand);
        if(this.lastAttack && this.lastAttack.finish){
            return moves;
        }
        if(!this.lastAttack || this.turn === this.lastAttack.no){
            //The last attack passed all the others
            for(let faceDown of KomaArray.getUnique(hand)){
                for(let attack of KomaArray.getUnique(hand)){
                    if(faceDown.equals(attack)){
                        if(KomaArray.count(hand, faceDown) < 2){
                            continue;
                        }
                    }
                    if(attack.isKing){
                        if(KomaArray.count(hand, Koma.ou) < 2 && !this.kingUsed){
                            continue;
                        }
                    }
                    moves.push(Move.ofFaceDown(this.turn, faceDown, attack));
                }
            }
        }else{
            //The other player's attack
            moves.push(Move.ofPass(this.turn));
            if(KomaArray.contains(hand, this.lastAttack.attack)){
                let block = this.lastAttack.attack;
                for(let attack of KomaArray.getUnique(hand)){
                    if(block.equals(attack) && KomaArray.count(hand, attack) < 2){
                        continue;
                    }
                    if(attack.isKing){
                        if(KomaArray.count(hand, Koma.ou) < 2 && !this.kingUsed){
                            continue;
                        }
                    }
                    moves.push(Move.ofMatch(this.turn, block, attack));
                }
            }
            if(KomaArray.contains(hand, Koma.ou) && Koma.ou.canBlock(this.lastAttack.attack)){
                for(let attack of KomaArray.getUnique(hand)){
                    if(attack.isKing && KomaArray.count(hand, Koma.ou) < 2){
                        continue;
                    }
                    if(attack.isKing){
                        moves.push(Move.ofMatch(this.turn, Koma.ou, Koma.gyoku));
                        moves.push(Move.ofMatch(this.turn, Koma.gyoku, Koma.ou));
                    }else{
                        if(KomaArray.containsExact(hand, Koma.ou)){
                            moves.push(Move.ofMatch(this.turn, Koma.ou, attack));
                        }
                        else{
                            moves.push(Move.ofMatch(this.turn, Koma.gyoku, attack));
                        }
                    }
                }
            }
        }
        return moves;
    }
}