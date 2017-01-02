import {default as Game} from "./game";
import {default as Table} from "./table";

/**  */
export class Core{

    /** create a new game */
    public static createGame():Game{
        return new Game();
    }

    /** create a new table and the dealer is player 1 */
    public static createTable():Table{
        return new Table(0);
    }
}