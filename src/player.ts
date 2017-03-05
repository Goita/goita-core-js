import { Koma, KomaArray } from './koma';
import { Define } from './define';

export class Player {
    /** player No. */
    public no: number;
    /** player's koma in hand */
    public hand: Array<Koma>;
    /** visible field */
    public field: Array<Koma>;
    /** hidden field */
    public hiddenfield: Array<Koma>;

    /** number of koma left in hand */
    public handCounter: number;
    /** number of koma put on field */
    public fieldCounter: number;

    public constructor(no: number, hand: string) {
        this.init(no, hand);
    }

    private init(no: number, hand: string) {
        this.no = no;
        this.hand = KomaArray.createFrom(hand);
        this.field = KomaArray.createEmptyField();
        this.hiddenfield = KomaArray.createEmptyField();
        this.handCounter = Define.maxFieldLength;
        this.fieldCounter = 0;
    }

    public putKoma(koma: Koma, faceDown: boolean = false): void {
        let i = this.hand.indexOf(koma);
        if (i < 0) {
            console.log("player#" + this.no + " does not have " + koma + " in hand");
            //console.log("the hand: ");
            //console.log(this.hand);
            throw "Does not have the koma";
        }
        this.hand[i] = Koma.empty;
        KomaArray.sortDesc(this.hand);
        this.handCounter--;
        if (faceDown) {
            this.field[this.fieldCounter] = Koma.hidden;
        } else {
            this.field[this.fieldCounter] = koma;
        }
        this.hiddenfield[this.fieldCounter] = koma;
        this.fieldCounter++;
    }

    public pickLastKoma(): void {
        if (this.fieldCounter === 0) {
            return;
        }
        let pickedKoma = this.hiddenfield[this.fieldCounter - 1];
        this.hiddenfield[this.fieldCounter - 1] = Koma.empty;
        this.field[this.fieldCounter - 1] = Koma.empty;
        this.fieldCounter--;
        this.hand[this.handCounter] = pickedKoma;
        KomaArray.sortDesc(this.hand);
        this.handCounter++;
    }

    /** return true, if there is a given koma in tegoma */
    public hasKoma(koma: Koma): boolean {
        return KomaArray.contains(this.hand, koma);
    }

    /** return true, if there is a given koma in tegoma */
    public hasKomaExact(koma: Koma): boolean {
        return KomaArray.containsExact(this.hand, koma);
    }

    /** count a given koma in tegoma  */
    public countKoma(koma: Koma): number {
        return KomaArray.count(this.hand, koma);
    }

    public getUniqueHand(): Array<Koma> {
        return KomaArray.getUnique(this.hand);
    }

    /**
     * get the hidden koma array(the places are indicated)
     *
     * @returns {Array<Koma>} hidden koma: koma value / visible koma or empty: null
     */
    public getHiddenKoma(): Array<Koma> {
        let diff = KomaArray.createEmptyField();
        if (this.field === null || this.hiddenfield === null
            || this.field.length !== this.hiddenfield.length) {
            return diff;
        }
        for (let i = 0; i < Define.maxFieldLength; i++) {
            if (this.field[i].equals(Koma.hidden)) {
                diff[i] = this.hiddenfield[i];
            }
        }
        return diff;
    }
}