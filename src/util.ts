import {Define} from './define';
import * as Random from 'random-js';

export module Util{
    let rand = new Random(Random.engines.mt19937().autoSeed());

    export function dealTegomas(): string[]{
        let komaCircle = Define.KOMA_CIRCLE.split('');
        shuffle(komaCircle);
        let tegomas = new Array<string>();
        for(let c of cut(komaCircle, 8)){
            tegomas.push(c.join());
        }
        return tegomas;
    }

    export function cut<T>(array:Array<T>, len: number): Array<Array<T>>{
        let ret = new Array<Array<T>>();
        for(let i=0;i< (array.length/len); i++){
            ret.push(array.slice(i*len, (i+1)*len));
        }
        return ret;
    }

    /** shuffle array - with Fisher-Yates algorithm */
    export function shuffle<T>(array: Array<T>){
        let n = array.length;
        for(let i = n - 1; i > 0; i--) {
            let j = rand.integer(0, i);
            let tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
        }
    }
}
