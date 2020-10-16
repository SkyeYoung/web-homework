/*
 * @Date: 2020-09-26 11:32:55
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-15 16:19:42
 * @FilePath: \程序\3\2.js
 */

/**
 * NN乘法表
 * @param {number} target N，乘数的最大值，比如 9
 */
const multiplicationTable = (target = 9) =>
  Array.from({ length: target }, (v, i) => i + 1)
    .map((v) =>
      Array.from({ length: v }, (v, i) => i + 1)
        .map((r) => `${r}*${v}=${v * r}`)
        .join('\t'),
    )
    .join('\n');

console.log(multiplicationTable());
