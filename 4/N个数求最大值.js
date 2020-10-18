/*
 * @Date: 2020-10-17 13:41:23
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-18 21:43:08
 * @FilePath: \程序\4\N个数求最大值.js
 *
 */

/**
 * 返回 N 个数中的最大值
 * @param  {...number} numArr
 */
const max = (...numArr) =>
  numArr.reduce((maxValue, value) => (maxValue < value ? value : maxValue));

const maxNum = max(1, 3, 4, 5, 8, 6);
console.log(`max number: ${maxNum}`);
