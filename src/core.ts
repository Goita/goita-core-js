import table from "./table";
import { default as player } from "./player";
export default class Core{
    log = ()=>{
        console.log("Hello! Node.js × TypeScript from Core Class");
    }

    test():string{
        return "test";
    }
    /**
     * 
     */
    hello(name:string):string{
        return "hello " + name;
    }
}