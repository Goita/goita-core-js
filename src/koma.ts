//CONSTANTS
  //x:空 0:不明 1:し 2:香 3:馬 4:銀 5:金 6:角 7:飛 8:王 9:玉

export const EMPTY = '0', HIDDEN = 'x';
export const SHI = '1', GON = '2', BAKKO = '3', GIN = '4', KIN = '5', KAKU = '6', HISHA = '7';
export const OU = '8', GYOKU = '9';
export const PASS = 'p';

export function getPoint(koma: string): number{
    let n = Number(koma);
    return Math.floor(n/2)*10 + 10;
}

export function getText(koma : string): string{
    let text = '';
    switch(koma){
        case HIDDEN:
            text = "■";
            break;
        case SHI:
            text = "し";
            break;
        case GON:
            text = "香";
            break;
        case BAKKO:
            text = "馬";
            break;
        case GIN:
            text = "銀";
            break;
        case KIN:
            text = "金";
            break;
        case KAKU:
            text = "角";
            break;
        case HISHA:
            text = "飛";
            break;
        case OU:
            text = "王";
            break;
        case GYOKU:
            text = "玉";
            break;
        default:
            break;
    }
    return text;
}

export function canBlock(semeKoma: string, ukeKoma: string): boolean{
    if(semeKoma === ukeKoma){
      return true;
    }
    
    if(ukeKoma === OU || ukeKoma === GYOKU){
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
    if(!koma1 || !koma2) return false;
    return koma1 === koma2 || (isKing(koma1) && isKing(koma2));
}