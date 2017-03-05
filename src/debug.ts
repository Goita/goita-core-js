import * as goita from "./";

const testBoard = goita.Board.createFromString("12345678,12345679,11112345,11112345,s1");
testBoard.play(goita.Koma.shi, goita.Koma.bakko);
let info = testBoard.toThinkingInfo();
console.log(info.lastAttack.block);


process.exit(0);