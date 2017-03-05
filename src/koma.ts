import { Define } from './define';

export class Koma {
    public readonly value: Define.KomaValue;

    private constructor(value: Define.KomaValue) {
        this.value = value;
    }

    //they are all static value, so these object are going to match to the same koma
    public static empty = new Koma(Define.empty);
    public static hidden = new Koma(Define.hidden);
    public static shi = new Koma(Define.shi);
    public static gon = new Koma(Define.gon);
    public static bakko = new Koma(Define.bakko);
    public static gin = new Koma(Define.gin);
    public static kin = new Koma(Define.kin);
    public static kaku = new Koma(Define.kaku);
    public static hisha = new Koma(Define.hisha);
    public static ou = new Koma(Define.ou);
    public static gyoku = new Koma(Define.gyoku);

    public static fromStr(val: string) {
        if (val === Define.empty) { return Koma.empty; }
        if (val === Define.hidden) { return Koma.hidden; }
        if (val === Define.shi) { return Koma.shi; }
        if (val === Define.gon) { return Koma.gon; }
        if (val === Define.bakko) { return Koma.bakko; }
        if (val === Define.gin) { return Koma.gin; }
        if (val === Define.kin) { return Koma.kin; }
        if (val === Define.kaku) { return Koma.kaku; }
        if (val === Define.hisha) { return Koma.hisha; }
        if (val === Define.ou) { return Koma.ou; }
        if (val === Define.gyoku) { return Koma.gyoku; }
        throw "Invalid koma value " + val + " was given";
    }

    public get Score(): number {
        if (this === Koma.hidden) {
            throw "cannot get the score of Koma.hidden";
        }
        let n = Number(this.value);
        return Math.floor(n / 2) * 10 + 10;
    }

    public get Text(): string {
        let text = '';
        switch (this.value) {
            case Define.empty: text = ""; break;
            // candidates ☖☐☗◼◯
            case Define.hidden: text = "[]"; break;
            case Define.shi: text = "し"; break;
            case Define.gon: text = "香"; break;
            case Define.bakko: text = "馬"; break;
            case Define.gin: text = "銀"; break;
            case Define.kin: text = "金"; break;
            case Define.kaku: text = "角"; break;
            case Define.hisha: text = "飛"; break;
            case Define.ou: text = "王"; break;
            case Define.gyoku: text = "玉"; break;
            default:
                break;
        }
        return text;
    }

    public get isKing(): boolean {
        return this.value === Define.ou || this.value === Define.gyoku;
    }

    /** return if this koma equals to the given koma. exception: "The OU equals the GYOKU" */
    public equals(target: Koma): boolean {
        if (target === undefined || target === null) {
            return false;
        }
        if (this.isKing && target.isKing) {
            return true;
        }
        return this.value === target.value;
    }

    /** return if this koma equals to the given koma. */
    public equalsExact(target: Koma): boolean {
        if (target === undefined || target === null) {
            return false;
        }
        return this.value === target.value;
    }

    public canBlock(attack: Koma): boolean {
        if (this.equals(attack)) {
            return true;
        }

        if (this.isKing) {
            if (attack.value === Define.shi || attack.value === Define.gon) {
                return false;
            }
            return true;
        }

        return false;
    }

    public toString(): string {
        return this.value;
    }
}

export class KomaArray {
    //currently cannot extends Array.prototype ES5.
    //implement array methods as util class instead to extend prototype.

    public static contains(target: Array<Koma>, koma: Koma): boolean {
        return target.some((k) => k.equals(koma));
    }

    public static containsExact(target: Array<Koma>, koma: Koma): boolean {
        return target.some((k) => k.equalsExact(koma));
    }

    public static count(target: Array<Koma>, koma: Koma): number {
        return target.filter((k) => koma.equals(k)).length;
    }

    public static countExact(target: Array<Koma>, koma: Koma): number {
        return target.filter((k) => koma.equalsExact(k)).length;
    }

    public static sortAsc(target: Array<Koma>): void {
        target.sort(KomaArray.comparerAsc);
    };

    public static sortDesc(target: Array<Koma>): void {
        target.sort(KomaArray.comparerDesc);
    };

    private static comparerDesc(a: Koma, b: Koma): number {
        if (a.value > b.value) { return -1; }
        if (a.value < b.value) { return 1; }
        return 0;
    }

    private static comparerAsc(a: Koma, b: Koma): number {
        return -KomaArray.comparerDesc(a, b);
    }

    public static getUnique(target: Koma[]): Array<Koma> {
        let uniqueList = new Array<Koma>();
        for (let koma of target) {
            if (koma.equals(Koma.empty)) {
                continue;
            }
            if (KomaArray.containsExact(uniqueList, koma)) {
                continue;
            }
            uniqueList.push(koma);
        }
        return uniqueList;
    }

    public static createFrom(hand_or_field: string) {
        if (!hand_or_field || hand_or_field.length < Define.maxFieldLength) {
            throw "wrong hand/field string format. it must be 8 charactors.";
        }
        let a = new Array<Koma>();
        for (let i = 0; i < Define.maxFieldLength; i++) {
            a[i] = Koma.fromStr(hand_or_field[i]);
        }
        return a;
    }

    public static createEmptyField(): Array<Koma> {
        let str = "";
        for (let i = 0; i < Define.maxFieldLength; i++) {
            str += Koma.empty.toString();
        }
        return KomaArray.createFrom(str);
    }

    public static toString(target: Array<Koma>): string {
        return target.join('');
    }

    public static toTextString(target: Array<Koma>): string {
        return target.map(k => k.Text).join('');
    }

    public static getLength(target: Array<Koma>): number {
        return target.filter((k) => k !== Koma.empty).length;
    }
}