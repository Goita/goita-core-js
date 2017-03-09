var goita = require("goita-core");

const games = 100;
let winCount = 0;
const game = goita.Factory.createGame();

for (let i = 0; i < games; i++) {
    game.startNewGame();
    while (!game.isEnd) {
        game.startNewDeal();
        if (game.board.isGoshiSuspended) {
            // redeal for goshi
            game.board.redeal();
        }
        while (!game.board.isEndOfDeal) {
            const info = game.board.toThinkingInfo();
            // choose your move
            const moves = info.getPossibleMoves();
            const i = goita.Util.rand.integer(0, moves.length - 1);
            game.board.playMove(moves[i]);
        }
        process.stdout.write(game.roundCount + " round has done. history: " + game.board.toHistoryString() + "\n");
    }

    process.stdout.write((i + 1) + "games done.\n");

    if (game.scores[0] > game.scores[1]) {
        winCount++;
    }
}

process.stdout.write("win/games: " + winCount + "/" + games + "\n");
process.stdout.write("win ratio: " + winCount / games * 100 + " [%]\n");

process.exit(0);
