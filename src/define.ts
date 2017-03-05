export module Define {
    export const defaultWinScore: number = 150;
    export const shiScore: number = 10;
    export const maxFieldLength: number = 8;
    export const maxPlayers: number = 4;
    export const historyStringDelimiter: string = ',';
    //CONSTANTS
    //x:不明 0:空 1:し 2:香 3:馬 4:銀 5:金 6:角 7:飛 8:王 9:玉 p:無し
    export type KomaValue = "x" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    export const empty: KomaValue = "0", hidden: KomaValue = 'x';
    export const shi: KomaValue = '1', gon: KomaValue = '2', bakko: KomaValue = '3', gin: KomaValue = '4', kin: KomaValue = '5', kaku: KomaValue = '6', hisha: KomaValue = '7';
    export const ou: KomaValue = '8', gyoku: KomaValue = '9';
    export const pass: string = 'p';
    export const yaku: string = 'y';
    export const komaCircle = '11111111112222333344445555667789';
    export const dealerChar: string = 's';
}

export enum Yaku {
    none,
    goshi,
    rokushi,
    nanashi,
    hachishi,
    goshigoshi_win,
    goshigoshi_opposite
}