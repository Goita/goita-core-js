import { Game } from "./game";
import { Board } from "./board";
import { Util} from "./util";

/** GoitaCore factory class */
export class Factory {

    /** create a new game */
    public static createGame(): Game {
        return new Game();
    }

    /** create a new board. initial hands and dealer are randomly chosen */
    public static createBoard(): Board {
        return Board.createRandomly(Util.rand.integer(0, 3));
    }

    /** create a board from history string */
    public static createBoardFromHistory(history: string): Board {
        return Board.createFromString(history);
    }
}
