import table from "./table";
import { default as player } from "./player";
export default class core{
    log = ()=>{
        let t = new table();
        t.log();
        let p = new player();
        p.log();
        console.log("Hello! Node.js × TypeScript from Core Class");
    }
}