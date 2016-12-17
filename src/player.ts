import {Koma, KomaCollection} from './koma';
import {Define} from './define';

export default class Player{

    /* player's koma in hand */
    tegoma: KomaCollection;
    /* visible field */
    field :KomaCollection;
    /* hidden field */
    _hiddenfield :KomaCollection;

    tegomaCounter:number;
    fieldCounter:number;

    no :number;
    
    constructor(no: number){
        this.no = no;
    }

    putKoma(koma: Koma):void{
        this.tegoma[this.tegoma.indexOf(koma)] = Koma.Empty;
        this.tegoma.sortDesc();
        this.tegomaCounter--;
        this.field[this.fieldCounter] = koma;
        this._hiddenfield[this.fieldCounter] = koma;
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
        if(this.field === null || this._hiddenfield === null 
            || this.field.length !== this._hiddenfield.length){
            return diff;
        }
        for(let i=0;i<Define.MAX_FIELD_LEN;i++){
            if(this.field[i].equals(Koma.Hidden)){
                diff[i] = this._hiddenfield[i];
            }
        }
        return diff;
    }
    
}