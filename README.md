[![Build Status](https://travis-ci.org/Goita/goita-core-js.svg?branch=master)](https://travis-ci.org/Goita/goita-core-js)

# Goita Core Library

It provides basic Goita game method, can be referenced by node.js application and web application.

## History String

A game state may be saved on one line string. Here is the format.

- the first 8 charactors(0-7) show 1st player's initial tegoma.
- the next 8 charactors(8-15) show 2nd player's initial tegoma.
- 16-23 will be 3rd's, 24-31 will be 4th's.
- following charactors (32-) show players play history.

```javascript
var first = "12345678";
var second = "12345679"
var third = "11112345";
var fourth = "11112345";
var play = "13pp31pp15";
var historyStr = first + second + third + fourth + play; 

//x:不明 0:空 1:し 2:香 3:馬 4:銀 5:金 6:角 7:飛 8:王 9:玉 p:無し
```