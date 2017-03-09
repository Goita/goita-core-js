import * as goita from "./";

let b = goita.Board.createFromString("11244556,12234569,11123378,11113457,s3,371,411,115,2p,3p,4p,145,252,3p,4p,124,242,323");
b.play(goita.Koma.bakko, goita.Koma.kin);
console.log(b);

// for (const evm of ret) {
//     // tslint:disable-next-line:no-console
//     console.log(evm.move.toOpenTextString() + ", " + evm.move.toOpenString() + " ,score: " + evm.score);
// }

process.exit(0);
