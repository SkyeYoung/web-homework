/*
 * @Date: 2020-10-20 23:01:36
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-20 23:23:14
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

calculator.register(pi);
