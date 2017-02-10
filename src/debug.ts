//import {Koma} from './koma';
//import {Move} from './history';
//import {Player} from './player';
// import {Board} from './board';
//import {ThinkingInfo} from './thinkinginfo';
import {Solver} from './solver';
//import {Factory} from './factory';
//import {AI, EvaluatedMove} from './ai.interface';

// let solver = new Solver();
// let results = solver.solve("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315,4p");
// console.log(results);

let solver = new Solver();
let results = solver.solve("12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315");
console.log(results);