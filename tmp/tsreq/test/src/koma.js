//CONSTANTS
//x:空 0:不明 1:し 2:香 3:馬 4:銀 5:金 6:角 7:飛 8:王 9:玉
"use strict";
exports.EMPTY = '0', exports.HIDDEN = 'x';
exports.SHI = '1', exports.GON = '2', exports.BAKKO = '3', exports.GIN = '4', exports.KIN = '5', exports.KAKU = '6', exports.HISHA = '7';
exports.OU = '8', exports.GYOKU = '9';
exports.PASS = 'p';
function getPoint(koma) {
    var n = Number(koma);
    return Math.floor(n / 2) * 10 + 10;
}
exports.getPoint = getPoint;
function getText(koma) {
    var text = '';
    switch (koma) {
        case exports.HIDDEN:
            text = "■";
            break;
        case exports.SHI:
            text = "し";
            break;
        case exports.GON:
            text = "香";
            break;
        case exports.BAKKO:
            text = "馬";
            break;
        case exports.GIN:
            text = "銀";
            break;
        case exports.KIN:
            text = "金";
            break;
        case exports.KAKU:
            text = "角";
            break;
        case exports.HISHA:
            text = "飛";
            break;
        case exports.OU:
            text = "王";
            break;
        case exports.GYOKU:
            text = "玉";
            break;
        default:
            break;
    }
    return text;
}
exports.getText = getText;
function canBlock(semeKoma, ukeKoma) {
    if (semeKoma === ukeKoma) {
        return true;
    }
    if (ukeKoma === exports.OU || ukeKoma === exports.GYOKU) {
        if (semeKoma === exports.SHI || semeKoma === exports.GON) {
            return false;
        }
        return true;
    }
    return false;
}
exports.canBlock = canBlock;
function isKing(koma) {
    return koma === exports.OU || koma === exports.GYOKU;
}
exports.isKing = isKing;
function areSame(koma1, koma2) {
    if (!koma1 || !koma2)
        return false;
    return koma1 === koma2 || (isKing(koma1) && isKing(koma2));
}
exports.areSame = areSame;
