import * as Define from './define';

//CONSTANTS
  //x:不明 0:空 1:し 2:香 3:馬 4:銀 5:金 6:角 7:飛 8:王 9:玉 p:無し

export const EMPTY = '0', HIDDEN = 'x';
export const SHI = '1', GON = '2', BAKKO = '3', GIN = '4', KIN = '5', KAKU = '6', HISHA = '7';
export const OU = '8', GYOKU = '9';
export const PASS = 'p';

function validateKomaValue(koma :string): boolean{
    if(!koma) {
        throw "invaled koma value is given";
    }
    return true;
}

export function createEmptyKomaArray(){
    let a = new Array<string>();
    for(let i=0;i<Define.MAX_FIELD_LEN;i++){
        a[i] = null;
    }
    return a;
}

export function getPoint(koma: string): number{
    let n = Number(koma);
    return Math.floor(n/2)*10 + 10;
}

export function getText(koma : string): string{
    let text = '';
    switch(koma){
        case HIDDEN: text = "■"; break;
        case SHI: text = "し"; break;
        case GON: text = "香"; break;
        case BAKKO: text = "馬"; break;
        case GIN: text = "銀"; break;
        case KIN: text = "金"; break;
        case KAKU: text = "角"; break;
        case HISHA: text = "飛"; break;
        case OU: text = "王"; break;
        case GYOKU: text = "玉"; break;
        default:
            break;
    }
    return text;
}

export function canBlock(semeKoma: string, ukeKoma: string): boolean{
    validateKomaValue(ukeKoma);
    validateKomaValue(semeKoma);

    if(semeKoma === ukeKoma){
      return true;
    }
    
    if(isKing(ukeKoma)){
      if(semeKoma === SHI || semeKoma === GON){
        return false;
      }
      return true;
    }

    return false;
}

export function isKing(koma:string):boolean{
    return koma === OU || koma === GYOKU;
}

export function areSame(koma1: string, koma2:string){
    validateKomaValue(koma1);
    validateKomaValue(koma2);
    return koma1 === koma2 || (isKing(koma1) && isKing(koma2));
}