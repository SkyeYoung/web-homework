/*
 * @Date: 2020-10-20 23:01:36
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-22 00:18:48
 * @FilePath: \程序\4\计算器\js\plugin.js
 */
import { calculator } from './calculator.js';

const pi = {
  name: 'mathPi',
  symbol: 'π',
  priorTo: ['others'],
  leftValIsOptional: true,
  needProcess: false,
  exec: (leftVal, rightVal) => (leftVal || 1) * Math.PI * rightVal,
};

const percent = {
  name: 'percentage',
  symbol: '%',
  priorTo: ['others'],
  leftValIsOptional: true,
  needProcess: false,
  exec: (leftVal, rightVal) => (leftVal || 0) + rightVal / 10,
};

calculator.register(pi);
calculator.register(percent);
