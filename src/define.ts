export module Define{
  export const defaultWinScore: number = 150;
  export const shiScore: number = 10;
  export const maxFieldLength : number = 8;
  export const maxPlayers : number = 4;
  export const historyStringDelimiter : string = ',';
  //CONSTANTS
    //x:不明 0:空 1:し 2:香 3:馬 4:銀 5:金 6:角 7:飛 8:王 9:玉 p:無し

  export const empty: string = '0', hidden: string = 'x';
  export const shi: string = '1', gon: string = '2', bakko: string = '3', gin: string = '4', kin: string = '5', kaku: string = '6', hisha: string = '7';
  export const ou: string = '8', gyoku: string = '9';
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
    goshigoshi_redeal
  }