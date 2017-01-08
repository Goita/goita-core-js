/// <reference path="../typings/index.d.ts" />

import {Define} from './define';
import * as Random from 'random-js';

export module Util{
    export let rand: Random = new Random(Random.engines.mt19937().autoSeed());

    export function dealTegomas(): string[]{
        let komaCircle = Define.komaCircle.split('');
        shuffle(komaCircle);
        let tegomas = new Array<string>();
        for(let c of cut(komaCircle, 8)){
            tegomas.push(c.join(''));
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

    /** 0->1, 1->2, 2->3, 3->0 */
    export function getNextTurn(turn:number):number{
        return (turn + 1) % 4;
    }

    /** 0->3, 1->0, 2->1, 3->2 */
    export function getPreviousTurn(turn:number):number{
        return (turn + 3) % 4;
    }
}
