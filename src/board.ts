import { Define, Yaku } from './define';
import { Koma, KomaArray } from './koma';
import { Player } from './player';
import { Move, FinishState, BoardHistory } from './history';
import { ThinkingInfo } from './thinkinginfo';
import { Util } from './util';
import { YakuInfo } from './yaku';



/** Goita Board Class */
export class Board {
    public players: Array<Player>;
    public history: BoardHistory;
    private redoStack: Array<Move>;
    private suspendedGoshi: boolean;
    private _yakuInfo: Array<YakuInfo>;

    private constructor() {
    }

    public get isEndOfDeal(): boolean {
        return (this.history.lastMove && this.history.lastMove.finish) ||
            this.history.finishState !== null;
    }

    public getFinishState(): FinishState {
        return this.history.finishState;
    }

    /** get initial-shi infomation */
    public get yakuInfo(): Array<YakuInfo> {
        return this._yakuInfo;
    }

    public get isGoshiSuspended(): boolean {
        return this.suspendedGoshi;
    }

    public get goshiPlayerNo(): Array<number> {
        return this._yakuInfo.filter((i) => i.yaku === Yaku.goshi || i.yaku === Yaku.goshigoshi_win || i.yaku === Yaku.goshigoshi_opposite).map((i)=> i.playerNo);
    }

    public get turnPlayer(): Player {
        return this.players[this.history.turn];
    }



    private init(dealer: number, tegomas: Array<string>): void {
        this.redoStack = new Array<Move>();
        this.history = new BoardHistory(dealer, tegomas);
        this.players = new Array<Player>();
        for (let i = 0; i < Define.maxPlayers; i++) {
            let player = new Player(i, tegomas[i]);
            this.players[i] = player;

        }
        this._yakuInfo = YakuInfo.from(this.players);
        this.suspendedGoshi = this._yakuInfo.some((i) => i.yaku === Yaku.goshi || i.yaku === Yaku.goshigoshi_opposite);
        if (this._yakuInfo.length === 1){
            const i = this._yakuInfo[0];
            if(i.yaku !== Yaku.goshi) {
                this.history.finishState = FinishState.ofFinish(i.playerNo, i.score);
            }
        } else if(this._yakuInfo.length >= 2){
            const i = this._yakuInfo[0];
            if(i.yaku === Yaku.goshigoshi_win) {
                this.history.finishState = FinishState.ofFinish(i.playerNo, i.score);
            }
        }
    }

    public play(block: Koma, attack: Koma, playablecheck: boolean = false): void {
        if (playablecheck) {
            if (!this.canPlay(block, attack)) {
                throw new Error("cannot play komas. block:" + block.value + " attack: " + attack.value + " in the board:" + this.toHistoryString());
            }
        }

        let move = this.createCurrentPlayersMove(block, attack);
        this.playMove(move);
    }

    public pass(playablecheck: boolean = false): void {
        if (playablecheck) {
            if (!this.canPass()) {
                throw new Error("cannot pass");
            }
        }
        let move = Move.ofPass(this.turnPlayer.no);
        this.playMove(move);
    }

    public playMove(move: Move): void {
        this.history.push(move);
        if (move.pass) {
            return;
        }
        let player = this.players[move.no];
        try{
            player.putKoma(move.block, move.faceDown);
            player.putKoma(move.attack);
        }catch(ex){
            throw new Error("cannot play move: " + move.toOpenString() + " in the board:" + this.toHistoryString());
        }
    }

    public continueGoshi(): void {
        this.suspendedGoshi = false;
    }

    /** finalize this board as redeal */
    public redeal(): void {
        if (this.suspendedGoshi) {
            this.history.finishState = FinishState.ofRedeal(this.history.dealer);
        }
    }

    /** finalize this board */
    public abort(): void {
        this.history.finishState = FinishState.ofAborted(this.history.dealer);
    }

    private createCurrentPlayersMove(block: Koma, attack: Koma): Move {
        if (this.turnPlayer.handCounter <= 2) {
            if (this.turnPlayer.no === this.history.lastAttacker && block.equals(attack)) {
                return Move.ofDoubleUpFinish(this.turnPlayer.no, block, attack);
            } else {
                return Move.ofFinish(this.turnPlayer.no, block, attack);
            }
        } else {
            if (this.turnPlayer.no === this.history.lastAttacker) {
                return Move.ofFaceDown(this.turnPlayer.no, block, attack);
            } else {
                return Move.ofMatch(this.turnPlayer.no, block, attack);
            }
        }
    }

    public canPlay(block: Koma, attack: Koma): boolean {
        if (this.isEndOfDeal) {
            return false;
        }

        let move = this.createCurrentPlayersMove(block, attack);
        return this.canPlayMove(move);
    }

    public canPass(): boolean {
        if (this.isEndOfDeal) {
            return false;
        }
        let passMove = Move.ofPass(this.turnPlayer.no);
        return this.canPlayMove(passMove);
    }

    public canPlayMove(move: Move): boolean {
        if (move.pass) {
            return this.turnPlayer.no !== this.history.lastAttacker;
        }

        if (move.faceDown && this.turnPlayer.no !== this.history.lastAttacker) {
            console.log("REASON: cannot play face down move, because I am not the last attacker");
            return false;
        }

        if (!move.faceDown && this.turnPlayer.no === this.history.lastAttacker) {
            console.log("REASON: must play face down move, because I am the last attaker");
            return false;
        }

        if (!move.faceDown && !move.block.canBlock(this.history.lastAttackMove.attack)) {
            console.log("REASON: cannot match to the last attack");
            return false;
        }

        //if block and attack are the same, must count koma left
        let counting = 1;
        if (move.block.equals(move.attack)) {
            counting = 2;
        }
        let player = this.players[this.history.turn];
        let inHand = player.countKoma(move.block) >= counting && player.countKoma(move.attack) > 0;

        //king check
        if (move.attack.isKing) {
            let canUseKing = (this.history.kingUsed > 0 || player.countKoma(Koma.ou) >= 2);
            return inHand && canUseKing;
        }
        return inHand;
    }

    public canUndo(): boolean {
        return this.history.moveStack.length > 0;
    }

    /** undo the latest move */
    public undo(): void {
        let move = this.history.pop();
        this.redoStack.push(move);
        if (!move.pass) {
            let player = this.players[move.no];
            player.pickLastKoma();
            player.pickLastKoma();
        }
    }

    public canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    public redo(): void {
        let move = this.redoStack.pop();
        if (move) {
            this.playMove(move);
        }
    }

    public static createRandomly(dealer: number): Board {
        let board = new Board();
        let tegomas = Util.dealTegomas();
        board.init(dealer, tegomas);
        return board;
    }

    /** create from history string */
    public static createFromString(historyStr: string): Board {
        let history = BoardHistory.fromString(historyStr);
        let board = new Board();
        board.init(history.dealer, history.hands);
        for (let i = 0; i < history.moveStack.length; i++) {
            board.continueGoshi();
            board.playMove(history.moveStack[i]);
        }

        return board;
    }

    /** table to history string */
    public toHistoryString(): string {
        return this.history.toString();
    }

    public toThinkingInfo(): ThinkingInfo {
        let turn = this.turnPlayer.no;
        const hand = KomaArray.toString(this.turnPlayer.hand);
        const hidden = KomaArray.toString(this.turnPlayer.hiddenfield);
        let fields = new Array<string>();
        for (let p of this.players) {
            fields.push(KomaArray.toString(p.field));
        }
        let lastAttack: Move = null;
        if (this.history.lastAttackMove) {
            lastAttack = this.history.lastAttackMove.clone();
            // hide face down koma if it's from another player
            if (turn !== lastAttack.no && lastAttack.faceDown) {
                lastAttack.block = Koma.hidden;
            }
        }

        // remove initial-condition-info. like "12345678,12345679,11112345,11112345,s1,"
        let history = this.history.toHiddenString().substring(39);

        return new ThinkingInfo(turn, this.history.dealer, hand, fields, hidden, lastAttack, this._yakuInfo, history);
    }
}
