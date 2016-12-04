import * as koma from './koma';
export default class Player{
    tegoma = new Array<string>();
    /* public field */
    field = new Array<string>();
    /* private field */
    _field = new Array<string>();
    
    constructor(){

    }
    
    /**
     * 
     */
    hasKoma = (koma: string):boolean =>{
        return this.tegoma.indexOf(koma) >= 0;
    }
    
    
}