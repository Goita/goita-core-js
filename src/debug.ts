// import {Koma} from './koma';
// import {Move} from './history';
//import {Player} from './player';
import {Board} from './board';
// import {ThinkingInfo} from './thinkinginfo';
import {Solver} from './solver';
//import {Factory} from './factory';
//import {AI, EvaluatedMove} from './ai.interface';


const h = "12667789,12345543,11112345,11112345,s1,116,2p,3p,4p,126,2p,3p,4p";
const board = Board.createFromString(h);
console.log(board);
const solver = new Solver();
const results = solver.solve(h);

for(const result of results){
    console.log(result.move.toOpenString() + ":"+ result.score + " , " + result.history.replace(h,""));
}
console.log(solver);