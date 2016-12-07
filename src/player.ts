import * as Koma from './koma';
import * as Define from './define';

export default class Player{

    /* player's koma in hand */
    tegoma: Array<string>;
    /* visible field */
    field :Array<string>;
    /* hidden field */
    _hiddenfield :Array<string>;

    tegomaCounter:number;
    fieldCounter:number;

    no :number;
    hasTurn :boolean;
    
    constructor(no: number){
        this.no = no;
    }

    putKoma = (koma: string):void =>{
        this.tegoma[this.tegoma.indexOf(koma)] = Koma.EMPTY;
        this.tegoma.sort(Player.sortDesc);
        this.tegomaCounter--;
        this.field[this.fieldCounter] = koma;
        this._hiddenfield[this.fieldCounter] = koma;
        this.fieldCounter++;
    }

    private static sortDesc = (a:string, b:string):number=>{
        if(a>b) {return -1;}
        if(a<b) {return 1;}
        return 0;
    }
    
    /**
     * player has a given koma in player's tegoma
     */
    hasKoma = (koma: string):boolean =>{
        return this.tegoma.indexOf(koma) >= 0;
    }
    
    /**
     * get the hidden koma array(the places are indicated)
     * 
     * @returns {Array<string>} hidden koma: koma value / visible koma or empty: null
     */
    getHiddenKoma =(): string[]=>
    {
        let diff = Koma.createEmptyKomaArray();
        if(this.field === null || this._hiddenfield === null 
            || this.field.length !== this._hiddenfield.length){
            return diff;
        }
        for(let i=0;i<Define.MAX_FIELD_LEN;i++){
            if(this.field[i] === Koma.HIDDEN){
                diff[i] = this._hiddenfield[i];
            }
        }
        return diff;
    }
    
}