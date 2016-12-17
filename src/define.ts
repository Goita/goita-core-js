export module Define{
  export const MAX_FIELD_LEN : number = 8;
  export const MAX_PLAYERS : number = 4;

  //CONSTANTS
    //x:不明 0:空 1:し 2:香 3:馬 4:銀 5:金 6:角 7:飛 8:王 9:玉 p:無し

  export const EMPTY: string = '0', HIDDEN: string = 'x';
  export const SHI: string = '1', GON: string = '2', BAKKO: string = '3', GIN: string = '4', KIN: string = '5', KAKU: string = '6', HISHA: string = '7';
  export const OU: string = '8', GYOKU: string = '9';
  export const PASS: string = 'p';
  export const KOMA_CIRCLE = '11111111112222333344445555667789';
}