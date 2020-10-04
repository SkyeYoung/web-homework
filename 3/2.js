/*
 * @Date: 2020-09-26 11:32:55
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-04 12:37:03
 * @FilePath: \程序\3\2.js
 */

/**
 * 九九乘法表
 * @param {Number} target 最大值，比如 9
 */
const multiplicationTable = (target = 9) => {
  Array.from({ length: target }, (v, i) => i + 1).forEach((v) => {
    const str = Array.from({ length: v }, (v, i) => i + 1)
      .map((r) => `${v}*${r}=${v * r}`)
      .join('\t');

    console.log(str);
  });
};

multiplicationTable();
