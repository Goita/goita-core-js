import * as goita from "./";

const solver = new goita.Solver();
let ret = solver.solve("24445679,11113336,11123457,11122558,s2,261,3p,4p,1p,213,331,411,1p,2p,311,415,154,2p,3p,482,124,2p,347");

ret.sort((m1, m2) => m2.score - m1.score);
for (const evm of ret) {
    // tslint:disable-next-line:no-console
    console.log(evm.move.toOpenTextString() + ", " + evm.move.toOpenString() + " ,score: " + evm.score);
}

process.exit(0);
