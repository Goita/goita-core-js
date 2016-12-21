import {Define} from './define';

export class Koma{
    public readonly value: string;

    private constructor(value: string){
        this.value = value;
    }

    //they are all static value, so these object are going to match to the same koma
    public static empty: Koma = new Koma(Define.empty);
    public static hidden: Koma = new Koma(Define.hidden);
    public static shi: Koma = new Koma(Define.shi);
    public static gon: Koma = new Koma(Define.gon);
    public static bakko: Koma = new Koma(Define.bakko);
    public static gin: Koma = new Koma(Define.gin);
    public static kin: Koma = new Koma(Define.kin);
    public static kaku: Koma = new Koma(Define.kaku);
    public static hisha: Koma = new Koma(Define.hisha);
    public static ou: Koma = new Koma(Define.ou);
    public static gyoku: Koma = new Koma(Define.gyoku);

    public static fromStr(val: string){
        if(val === Define.empty) {return Koma.empty;}
        if(val === Define.hidden) {return Koma.hidden;}
        if(val === Define.shi) {return Koma.shi;}
        if(val === Define.gon) {return Koma.gon;}
        if(val === Define.bakko) {return Koma.bakko;}
        if(val === Define.gin) {return Koma.gin;}
        if(val === Define.kin) {return Koma.kin;}
        if(val === Define.kaku) {return Koma.kaku;}
        if(val === Define.hisha) {return Koma.hisha;}
        if(val === Define.ou) {return Koma.ou;}
        if(val === Define.gyoku) {return Koma.gyoku;}
        throw "Invalid koma value " + val + " was given";
    }

    public get Point(): number{
        let n = Number(this.value);
        return Math.floor(n/2)*10 + 10;
    }

    public get Text(): string{
        let text = '';
        switch(this.value){
            case Define.hidden: text = "■"; break;
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

    public get isKing():boolean{
        return this.value === Define.ou || this.value === Define.gyoku;
    }

    /** return if this koma equals to the given koma. exception: "The OU equals the GYOKU" */
    public equals(target:Koma):boolean{
        if(this.isKing && target.isKing)
        {
            return true;
        }
        return this.value === target.value;
    }

    public canBlock(attack: Koma): boolean{
        if(this.equals(attack)){
            return true;
        }

        if(this.isKing)
        {
            if(attack.value === Define.shi || attack.value === Define.gon){
                return false;
            }
            return true;
        }

        return false;
    }
}

export class KomaCollection extends Array<Koma>{

    public contains(koma: Koma): boolean{
        return this.some((k)=>k.equals(koma));
    }

    public count(koma: Koma): number{
        return this.filter(koma.equals).length;
    }

    public sortAsc():void{
        this.sort(KomaCollection.comparerAsc);
    }

    public sortDesc():void{
        this.sort(KomaCollection.comparerDesc);
    }

    private static comparerDesc(a:Koma, b:Koma):number{
        if(a.value>b.value) {return -1;}
        if(a.value<b.value) {return 1;}
        return 0;
    }

    private static comparerAsc(a:Koma, b:Koma):number{
        return -KomaCollection.comparerDesc(a, b);
    }

    public static createEmptyField(): KomaCollection{
        let a = new KomaCollection();
        for(let i=0;i<Define.maxFieldLength;i++){
            a[i] = Koma.empty;
        }
        return a;
    }

    public static createTegomaFrom(tegoma: string){
        let a = new KomaCollection();
        for(let i = 0; i< Define.maxFieldLength; i++){
            a[i] = Koma.fromStr(tegoma[i]);
        }
        return a;
    }
}