/*
 * @Date: 2020-10-18 16:54:31
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-18 18:54:42
 * @FilePath: \程序\4\计算器\js\index.js
 */
const Calculator = {
  value: 0,
  lastValue: 0,

  setValue(newValue) {
    this.value = newValue;
  },

  printValue() {
    console.log(this.value);
    this.lastValue = this.value;
    this.value = 0;
  },

  plus(addend) {
    this.setValue(this.value + addend);
  },

  minus(subtrahend) {
    this.setValue(this.value - subtrahend);
  },
};
