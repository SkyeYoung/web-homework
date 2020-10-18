/*
 * @Date: 2020-10-17 11:38:17
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-17 11:48:06
 * @FilePath: \程序\4\倒计时.js
 */

//  双十一
const d11 = new Date('2020/11/11');

setInterval(() => {
  // 以秒为单位
  const time = (d11.getTime() - new Date().getTime()) / 1000;
  const s = Math.floor(time % 60);
  const m = Math.floor((time / 60) % 60);
  const h = Math.floor((time / 60 / 60) % 24);
  const d = Math.floor(time / 60 / 60 / 24);

  console.log(`距离双十一还有 ${d} 天 ${h} 时 ${m} 分 ${s} 秒`);
}, 1000);
