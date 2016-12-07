export default class PlayMemo{
    no:number;
    attack:string;
    block:string;
    pass: boolean;
    faceDown: boolean;

    private constructor(no:number){
        this.no = no;
        this.pass = false;
        this.faceDown = false;
    }

    static Match = (no: number, blockKoma:string, attackKoma:string):PlayMemo=>{
        let memo = new PlayMemo(no);
        memo.block = blockKoma;
        memo.attack = attackKoma;
        memo.pass = false;
        memo.faceDown = false;
        return memo;
    }

    static FaceDown = (no: number, blockKoma:string, attackKoma:string):PlayMemo=>{
        let memo = PlayMemo.Match(no, blockKoma, attackKoma);
        memo.faceDown = true;
        return memo;
    }

    static Pass = (no: number):PlayMemo=>{
        let memo = new PlayMemo(no);
        memo.pass = true;
        return memo;
    }
}