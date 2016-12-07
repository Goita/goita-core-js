import Table from "./table";

export default class Core{
    log = ()=>{
        console.log("Hello! Node.js x TypeScript from Core Class");
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