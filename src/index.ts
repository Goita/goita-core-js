/// <reference path="../typings/main.d.ts" />
import table from './table';
exports.table = table;

import player from './player';
exports.player = player;

import core from './core';
exports.core = core;

let c = new core();
c.log();