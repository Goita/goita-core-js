[![Build Status](https://travis-ci.org/Goita/goita-core-js.svg?branch=master)](https://travis-ci.org/Goita/goita-core-js)

# Goita Core Library

It provides basic Goita game method, can be referenced by node.js application and web application.

## Goita rules

Rules([Japanese](http://goita.jp/?p=102))|([English](https://www.pagat.com/climbing/goita.html))

## Usage

To start the 150 point match game, create game object.

__Node.js__

```javascript
import {GoitaCore, Koma} from "goita-core-js";
let game = GoitaCore.createGame();
game.startNewGame();
//deal the all koma randomly
game.startNewDeal();
console.log("dealer is player" + game.table.currentPlayer.no);
game.table.play(Koma.shi, Koma.kin);
//...and so on
//is the table finished to deal?
if(game.table.isEndOfDeal){
    game.startNewDeal(); //Next Deal until any player wins
}
```

## History string
---

A game state may be saved on one line string. Here is the format.
It aims for human readable and writable, giving up the effect of minimum data size. It is still small size. 

- The first 8 charactors show 1st player's initial tegoma.
- The next 8 charactors show 2nd player's initial tegoma.
- the next 8 will be 3rd's, and the next will be 4th's.
- 's' & player no. show start player(dealer).
- Following charactors show players play moves.
- Play move is constructed with 2 or 3 charactors. the first charactor shows player no(1-4). If the 2nd charactor is "p" then, the play move shows pass, otherwise the 2nd shows the block(match) move and the 3rd shows the attack move.

```javascript
//x:不明 0:空 1:し 2:香 3:馬 4:銀 5:金 6:角 7:飛 8:王 9:玉 p:無し
let player1 = "12345678";
let player2 = "12345679";
let player3 = "11112345";
let player4 = "11112345";
let dealer = "s1";
let playmoves = "113,2p,3p,431,1p,2p,315";
let historyStr = player1 + "," + player2 + "," + player3 + "," + player4 + "," + dealer + "," + playmoves;
//console.log(historyStr); //12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315

```