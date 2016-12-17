import Table from "./table";
import {Koma, KomaCollection} from "./koma";

export default class Core{
    log = ()=>{
        console.log("Hello! Node.js x TypeScript from Core Class");
    }

    test():void{
        let list :KomaCollection;
        list = new KomaCollection();
        list.push(Koma.Shi);
        list.push(Koma.Shi);
        list.push(Koma.Shi);
        list.push(Koma.Shi);
        list.push(Koma.Gon);
        let ret = list.indexOf(Koma.Gon);

        console.log("indexOf returns " + ret);
    }
    /**
     * 
     */
    hello(name:string):string{
        return "hello " + name;
    }
}