import {Game} from "./game";
import {Board} from "./board";

/** GoitaCore factory class */
export class Factory{

    /** create a new game */
    public static createGame():Game{
        return new Game();
    }

    /** create a new board and the dealer is player 1 */
    public static createBoard():Board{
        return Board.createRandomly(0);
    }

    /** create a board from history string */
    public static createBoardFromHistory(history:string):Board{
        return Board.createFromString(history);
    }
}