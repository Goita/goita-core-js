import PlayMemo from './playmemo';
export default class History{

    _history : Array<PlayMemo>;
    private constructor(){
        this._history = new Array<PlayMemo>();
    }

    static CreateEmpty = ():History=>{
        return new History();
    }
    static Resume = (historyStr:string):History=>{
        let h = new History();
        
        return h;
    }
}