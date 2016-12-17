import {Define} from './define';

export class Koma{
    public readonly Value: string;

    private constructor(value: string){
        this.Value = value;
    }

    //they are all static value, so these object are going to match to the same koma
    public static Empty: Koma = new Koma(Define.EMPTY);
    public static Hidden: Koma = new Koma(Define.HIDDEN);
    public static Shi: Koma = new Koma(Define.SHI);
    public static Gon: Koma = new Koma(Define.GON);
    public static Bakko: Koma = new Koma(Define.BAKKO);
    public static Gin: Koma = new Koma(Define.GIN);
    public static Kin: Koma = new Koma(Define.KIN);
    public static Kaku: Koma = new Koma(Define.KAKU);
    public static Hisha: Koma = new Koma(Define.HISHA);
    public static Ou: Koma = new Koma(Define.OU);
    public static Gyoku: Koma = new Koma(Define.GYOKU);

    public static fromStr(val: string){
        if(val === Define.EMPTY) {return Koma.Empty;}
        if(val === Define.HIDDEN) {return Koma.Hidden;}
        if(val === Define.SHI) {return Koma.Shi;}
        if(val === Define.GON) {return Koma.Gon;}
        if(val === Define.BAKKO) {return Koma.Bakko;}
        if(val === Define.GIN) {return Koma.Gin;}
        if(val === Define.KIN) {return Koma.Kin;}
        if(val === Define.KAKU) {return Koma.Kaku;}
        if(val === Define.HISHA) {return Koma.Hisha;}
        if(val === Define.OU) {return Koma.Ou;}
        if(val === Define.GYOKU) {return Koma.Gyoku;}
        throw "Invalid koma value " + val + " was given";
    }

    public get Point(): number{
        let n = Number(this.Value);
        return Math.floor(n/2)*10 + 10;
    }

    public get Text(): string{
        let text = '';
        switch(this.Value){
            case Define.HIDDEN: text = "■"; break;
            case Define.SHI: text = "し"; break;
            case Define.GON: text = "香"; break;
            case Define.BAKKO: text = "馬"; break;
            case Define.GIN: text = "銀"; break;
            case Define.KIN: text = "金"; break;
            case Define.KAKU: text = "角"; break;
            case Define.HISHA: text = "飛"; break;
            case Define.OU: text = "王"; break;
            case Define.GYOKU: text = "玉"; break;
            default:
                break;
        }
        return text;
    }

    public get isKing():boolean{
        return this.Value === Define.OU || this.Value === Define.GYOKU;
    }

    /** return if this koma equals to the given koma. exception: "The OU equals the GYOKU" */
    public equals(target:Koma):boolean{
        if(this.isKing && target.isKing) 
        {
            return true;
        }
        return this.Value === target.Value;
    }

    public canBlock(semeKoma: Koma): boolean{  
        if(this.equals(semeKoma)){
            return true;
        }
        
        if(this.isKing)
        {
            if(semeKoma.Value === Define.SHI || semeKoma.Value === Define.GON){
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
        if(a.Value>b.Value) {return -1;}
        if(a.Value<b.Value) {return 1;}
        return 0;
    }

    private static comparerAsc(a:Koma, b:Koma):number{
        return -KomaCollection.comparerDesc(a, b);
    }

    public static createEmptyField(): KomaCollection{
        let a = new KomaCollection();
        for(let i=0;i<Define.MAX_FIELD_LEN;i++){
            a[i] = Koma.Empty;
        }
        return a;
    }

    public static createTegomaFrom(tegoma: string){
        let a = new KomaCollection();
        for(let i = 0; i< Define.MAX_FIELD_LEN; i++){
            a[i] = Koma.fromStr(tegoma[i]);
        }
        return a;
    }
}