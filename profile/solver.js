const goita = require("../lib");

const b = goita.Board.createFromString("11244556,12234569,11123378,11113457,s3,371,411,115,2p,3p,4p,145,252,3p,4p,124,242,321");
console.log(b.history.attackerLog.length + " attacks has been played");

console.time("solver");
const solver = new goita.Solver();
const ret = solver.solve(b.toHistoryString());
console.timeEnd("solver");
for (const evm of ret) {
    console.log(evm.move.toOpenTextString() + ": " + evm.move.toOpenString() + ", score: " + evm.score);
}


process.exit(0);
