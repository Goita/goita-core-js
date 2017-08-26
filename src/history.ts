import { Koma, KomaArray } from './koma';
import { Define } from './define';
import { Util } from './util';

export class Move {
    describe: string;
    no: number;
    attack: Koma;
    block: Koma;
    pass: boolean;
    faceDown: boolean;
    finish: boolean;
    doubleUp: boolean;

    private constructor(no: number) {
        this.no = no;
        this.pass = false;
        this.faceDown = false;
        this.finish = false;
        this.doubleUp = false;
    }

    /** block and attack move */
    public static ofMatch(no: number, blockKoma: Koma, attackKoma: Koma): Move {
        let move = new Move(no);
        move.describe = "Match";
        move.block = blockKoma;
        move.attack = attackKoma;
        move.pass = false;
        move.faceDown = false;
        return move;
    }

    /** face down and attack move */
    public static ofFaceDown(no: number, blockKoma: Koma, attackKoma: Koma): Move {
        let move = Move.ofMatch(no, blockKoma, attackKoma);
        move.describe = "FaceDown";
        move.faceDown = true;
        move.pass = false;
        return move;
    }

    /** pass move */
    public static ofPass(no: number): Move {
        let move = new Move(no);
        move.describe = "Pass";
        move.attack = null;
        move.block = null;
        move.pass = true;
        return move;
    }

    public static ofFinish(no: number, block: Koma, final: Koma): Move {
        let move = Move.ofMatch(no, block, final);
        move.describe = "Finish";
        move.finish = true;
        return move;
    }

    public static ofDoubleUpFinish(no: number, block: Koma, final: Koma): Move {
        let move = Move.ofFinish(no, block, final);
        move.describe = "x2Finish";
        move.doubleUp = true;
        return move;
    }

    public static fromStr(move: string, attaker?: number): Move {
        let no = Number(move[0]) - 1;
        if (move[1] === Define.pass) {
            return Move.ofPass(no);
        }
        if (attaker !== undefined && no === attaker) {
            return Move.ofFaceDown(no, Koma.fromStr(move[1]), Koma.fromStr(move[2]));
        }
        return Move.ofMatch(no, Koma.fromStr(move[1]), Koma.fromStr(move[2]));
    }

    public toString(): string {
        if (this.pass || this.doubleUp) {
            return this.toOpenString();
        }
        return (this.no + 1) + (this.faceDown ? Define.hidden : this.block.value) + this.attack.value;
    }

    public toOpenString(): string {
        if (this.pass) {
            return (this.no + 1) + Define.pass;
        }
        return (this.no + 1) + this.block.value + this.attack.value;
    }

    public toTextString(): string {
        if (this.pass) {
            return "なし";
        }
        if (this.faceDown) {
            return Koma.hidden.Text + this.attack.Text;
        } else {
            return this.block.Text + this.attack.Text;
        }
    }

    public toOpenTextString(): string {
        if (this.pass) {
            return "なし";
        }
        return this.block.Text + this.attack.Text;
    }

    public toScore(): number {
        let score = this.attack.score;
        return this.doubleUp ? score * 2 : score;
    }

    public clone(): Move {
        const m = new Move(this.no);
        m.attack = this.attack;
        m.block = this.block;
        m.describe = this.describe;
        m.doubleUp = this.doubleUp;
        m.faceDown = this.faceDown;
        m.finish = this.finish;
        m.pass = this.pass;
        return m;
    }
}

/** finish state of board */
export class FinishState {
    nextDealerNo: number;
    redeal: boolean;
    aborted: boolean;
    wonScore: number;

    private constructor() {
        this.nextDealerNo = -1;
        this.redeal = false;
        this.aborted = false;
        this.wonScore = 0;
    }

    public static ofFinish(no: number, score: number): FinishState {
        let f = new FinishState();
        f.nextDealerNo = no;
        f.wonScore = score;
        return f;
    }

    public static ofRedeal(no: number): FinishState {
        let f = new FinishState();
        f.nextDealerNo = no;
        f.redeal = true;
        return f;
    }

    public static ofAborted(no: number): FinishState {
        let f = new FinishState();
        f.nextDealerNo = no;
        f.aborted = true;
        return f;
    }
}

export class BoardHistory {
    public moveStack: Array<Move>;
    public attackerLog: Array<number>;
    public turn: number;
    public kingUsed: number;
    public finishState: FinishState;

    //initial static info
    public hands: Array<string>;
    public dealer: number;

    public constructor(dealer: number, hands: Array<string>) {
        this.init(dealer, hands);
    }

    private init(dealer: number, hands: Array<string>) {
        this.moveStack = new Array<Move>();
        this.hands = hands;
        this.attackerLog = new Array<number>();
        this.turn = dealer;
        this.dealer = dealer;
        this.kingUsed = 0;
        this.finishState = null;
    }

    public get lastMove(): Move {
        if (this.moveStack.length === 0) {
            return null;
        }
        return this.moveStack[this.moveStack.length - 1];
    }

    public get lastAttacker(): number {
        if (this.attackerLog.length === 0) {
            return this.dealer;
        }
        return this.attackerLog[this.attackerLog.length - 1];
    }

    public get lastAttackMove(): Move {
        for (let i = (this.moveStack.length - 1) | 0; i >= 0; i = (i - 1) | 0) {
            let m = this.moveStack[i];
            if (!m.pass) {
                return m;
            }
        }
        return null;
    }

    public push(move: Move) {
        //replace if the move is finish one
        let attackCount = this.attackerLog.filter(n => n === move.no).length;
        if (attackCount === 3 && !move.pass) {
            if (this.lastAttacker === move.no && move.attack.equals(move.block)) {
                move = Move.ofDoubleUpFinish(move.no, move.block, move.attack);
            } else {
                move = Move.ofFinish(move.no, move.block, move.attack);
            }
        }

        this.moveStack.push(move);
        if (!move.pass) {
            this.attackerLog.push(move.no);
            if ((move.block.isKing && !move.faceDown)) {
                this.kingUsed++;
            }
            if (move.attack.isKing) {
                this.kingUsed++;
            }
        }
        this.turn = Util.getNextTurn(move.no);

        if (this.lastMove.finish) {
            this.finishState = FinishState.ofFinish(this.lastMove.no, this.lastMove.toScore());
        }
    }

    public pop(): Move {
        let move = this.moveStack.pop();
        if (!move.pass) {
            this.attackerLog.pop();

            if ((move.block.isKing && !move.faceDown)) {
                this.kingUsed--;
            }
            if (move.attack.isKing) {
                this.kingUsed--;
            }
        }
        this.finishState = null;
        this.turn = Util.getPreviousTurn(this.turn);

        return move;
    }

    public static fromString(history: string): BoardHistory {
        let historyArray = history.split(Define.historyStringDelimiter);

        let tegomas = new Array<string>();
        for (let i = 0; i < (Define.maxPlayers | 0); i = (i + 1) | 0) {
            tegomas.push(historyArray[i]);
        }

        let dealer = Number(historyArray[Define.maxPlayers].substring(1, 2)) - 1;
        if (dealer < 0 || Define.maxPlayers <= dealer) {
            throw new Error("Dealer No. is out-of-range: the given value was " + dealer);
        }
        let moves = BoardHistory.parseMoveHistory(historyArray.slice(Define.maxPlayers + 1));

        let boardHistory = new BoardHistory(dealer, tegomas);

        for (let move of moves) {
            boardHistory.push(move);
        }
        return boardHistory;
    }

    public static parseMoveHistory(moveHistory: Array<string>): Array<Move> {
        let moves = new Array<Move>();

        if (!moveHistory || moveHistory.length === 0) {
            return moves;
        }
        let attacker: number = Number(moveHistory[0].charAt(0)) - 1;

        for (let m of moveHistory) {
            if (!m || m.length === 0) {
                continue;
            }
            let move = Move.fromStr(m, attacker);
            moves.push(move);
            if (!move.pass) {
                attacker = move.no;
            }
        }
        return moves;
    }

    public toString(): string {
        let str = new Array<string>();
        for (let i = 0; i < (Define.maxPlayers | 0); i = (i + 1) | 0) {
            const hand = KomaArray.createFrom(this.hands[i]).sort();
            str.push(KomaArray.toString(hand));
        }
        str.push(Define.dealerChar + (this.dealer + 1));
        for (let move of this.moveStack) {
            str.push(move.toOpenString());
        }
        return str.join(Define.historyStringDelimiter);
    }

    /** describe history to observers */
    public toAllHiddenString(): string {
        return this.toHiddenString(-1);
    }

    /** describe history in the view of given player no */
    public toHiddenString(no: number): string {
        let str = new Array<string>();
        for (let i = 0; i < (Define.maxPlayers | 0); i = (i + 1) | 0) {
            if (i === no) {
                const hand = KomaArray.createFrom(this.hands[i]).sort();
                str.push(KomaArray.toString(hand));
            } else {
                str.push(null); //empty for the space
            }
        }
        str.push(Define.dealerChar + (this.dealer + 1));
        for (const move of this.moveStack) {
            if (move.no === no) {
                str.push(move.toOpenString());
            } else {
                // put hidden info
                str.push(move.toString());
            }
        }

        // fill other players hand
        const hands = [] as Koma[][];
        for (let i = 0; i < 4; i++) {
            hands[i] = [];
        }
        for (const move of this.moveStack) {
            if (move.no === no || move.pass) {
                continue;
            }

            if (!move.block.isHidden && !move.faceDown) {
                hands[move.no].push(move.block);
            }

            if (!move.attack.isHidden) {
                hands[move.no].push(move.attack);
            }
        }


        for (let i = 0; i < 4; i++) {
            if (i === no) { continue; }

            const hand = hands[i];
            // fill goshi hand
            const initHand = KomaArray.createFrom(this.hands[i]);
            const shiCount = KomaArray.count(initHand, Koma.shi);
            if (shiCount >= 5) {
                while (KomaArray.count(hand, Koma.shi) < shiCount) {
                    hand.push(Koma.shi);
                }
            }

            // fill hidden
            while (KomaArray.getLength(hand) < Define.maxFieldLength) {
                hand.push(Koma.hidden);
            }

            // replace
            KomaArray.sortAsc(hand);
            str[i] = KomaArray.toString(hand);
        }
        return str.join(Define.historyStringDelimiter);
    }
}
