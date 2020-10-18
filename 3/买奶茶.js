/*
 * @Date: 2020-09-26 10:48:58
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-17 15:03:28
 * @FilePath: \程序\3\买奶茶.js
 */

/*
 * 买奶茶
 */

const price = 10;
const discount = 0.5;
let cup = 5;

// 每第二杯打折
const wholePrice = (cup, price, discount) =>
  Math.floor(cup / 2) * (price * (1 + discount));

// 最终结果
const result = wholePrice(cup, price, discount) + (cup % 2 !== 0 && price);

console.log(result);
