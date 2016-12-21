import {Koma, KomaCollection} from './koma';
import {Define} from './define';

export default class Player{

    /* player's koma in hand */
    tegoma: KomaCollection;
    /* visible field */
    field :KomaCollection;
    /* hidden field */
    hiddenfield :KomaCollection;

    tegomaCounter:number;
    fieldCounter:number;

    no :number;

    constructor(no: number){
        this.no = no;
    }

    putKoma(koma: Koma, faceDown:boolean = false):void{
        this.tegoma[this.tegoma.indexOf(koma)] = Koma.empty;
        this.tegoma.sortDesc();
        this.tegomaCounter--;
        if(faceDown){
            this.field[this.fieldCounter] = Koma.hidden;
        }else{
            this.field[this.fieldCounter] = koma;
        }
        this.hiddenfield[this.fieldCounter] = koma;
        this.fieldCounter++;
    }

    /** return true, if there is a given koma in tegoma */
    hasKoma(koma: Koma):boolean{
        return this.tegoma.indexOf(koma) >= 0;
    }

    /** count a given koma in tegoma  */
    countKoma(koma: Koma): number{
        return this.tegoma.filter((k)=> k.equals(koma)).length;
    }

    /**
     * get the hidden koma array(the places are indicated)
     * 
     * @returns {Array<string>} hidden koma: koma value / visible koma or empty: null
     */
    getHiddenKoma(): Koma[]{
        let diff = KomaCollection.createEmptyField();
        if(this.field === null || this.hiddenfield === null
            || this.field.length !== this.hiddenfield.length){
            return diff;
        }
        for(let i=0;i<Define.maxFieldLength;i++){
            if(this.field[i].equals(Koma.hidden)){
                diff[i] = this.hiddenfield[i];
            }
        }
        return diff;
    }
}