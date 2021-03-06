Goita Core Library
===
This library provides Goita game methods.

[![Build Status](https://travis-ci.org/Goita/goita-core-js.svg?branch=master)](https://travis-ci.org/Goita/goita-core-js)

Install
---
```
npm install goita-core
```

About Goita
---
- Noto Goita Preservation Society's official website [http://goita.jp](http://goita.jp)
- Rules([Japanese](http://goita.jp/rule/))|([English](https://www.pagat.com/climbing/goita.html))

Sample code
---
see [/sample/sample1.js](./sample/sample1.js)

HistoryString
---

A game state may be saved on one line string. Here is the format.
It aims for human readable and writable.

- The first 8 charactors show 1st player's initial tegoma.
- The next 8 charactors show 2nd player's initial tegoma.
- the next 8 will be 3rd's, and the next will be 4th's.
- 's' & player no. show start player(dealer).
- Following charactors show 'Players moves'.
- Play move is constructed with 2 or 3 charactors. the first charactor shows player no(1-4). If the 2nd charactor is "p" then, the play move shows pass, otherwise the 2nd shows the block(match) move and the 3rd shows the attack move.


```javascript
//x:不明 0:空 1:し 2:香 3:馬 4:銀 5:金 6:角 7:飛 8:王 9:玉 p:なし
let p1 = "12345678";
let p2 = "12345679";
let p3 = "11112345";
let p4 = "11112345";
let dealer = "s1";
let playmoves = "113,2p,3p,431,1p,2p,315";
let historyStr = p1 + "," + p2 + "," + p3 + "," + p4 + "," 
                + dealer + "," + playmoves;
//console.log(historyStr); //12345678,12345679,11112345,11112345,s1,113,2p,3p,431,1p,2p,315
```

Licence
---
MIT License.
