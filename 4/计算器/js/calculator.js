/*
 * @Date: 2020-10-18 19:16:04
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-20 00:48:13
 * @FilePath: \程序\4\计算器\js\calculator.js
 */

const { insert } = require('./tool');

/**
 * 基础计算器
 */
const basicCalc = {
  // 当前值，存储运算结果
  currentValue: '0',
  // 精度，小数点后 N 位
  precision: 6,
  canUseBigInt: 'BigInt' in globalThis,
  // 核心计算操作，形式同插件
  core: {
    plus: {
      name: 'plus',
      symbol: '+',
      priorTo: [],
      exec: (leftVal, rightVal) => leftVal + rightVal,
    },
    minus: {
      name: 'minus',
      symbol: '-',
      priorTo: [],
      leftValIsOptional: true,
      exec: (leftVal = 0, rightVal) => leftVal - rightVal,
    },
    multiply: {
      name: 'multiply',
      symbol: '×',
      priorTo: ['+', '-'],
      leftValIsOptional: false,
      exec: (leftVal, rightVal) => leftVal * rightVal,
    },
    division: {
      name: 'division',
      symbol: '÷',
      priorTo: ['+', '-'],
      leftValIsOptional: false,
      exec: (leftVal, rightVal) => leftVal / rightVal,
    },
    // TODO 不应该设计在这里
    decimal: {
      name: 'decimal',
      symbol: '.',
      priorTo: ['others'],
      leftValIsOptional: true,
      exec: (leftVal = 0, rightVal) => parseFloat(`${leftVal}.${rightVal}`),
    },
  },
  // 插件
  plugins: {},
  // 符号，对应插件名
  symbols: {
    '+': 'plus',
    '-': 'minus',
    '×': 'multiply',
    '÷': 'division',
    '.': 'decimal',
  },
  /**
   * 设置值
   * @param {string} value 值
   */
  set(value) {
    this.currentValue = value;
  },
  /**
   * 获取值
   */
  get() {
    return this.currentValue;
  },
  /**
   * 打印值
   */
  print() {
    console.log(this.get());
  },
  /**
   * 插件对应操作
   * @callback actionFunction
   * @param {number} leftVal 操作符的左值
   * @param {number} rightVal 操作符的右值
   * @returns {number} 返回数据
   */

  /**
   * 注册插件
   * @param {Object} plugin 插件
   * @param {string} plugin.name 插件名，限制字符长度 4 以上
   * @param {string} plugin.symbol 插件对应的符号，限制字符长度 1~3
   * @param {string[]} plugin.priorTo=[] 插件对应操作的优先级（算术优先级），数组中存在 'others' 则表明优先级比其他都高
   * @param {boolean} plugin.leftValIsOptional=false 插件对应操作的是否可在左值不存在的情况下工作（比如，'.2333' 这种）
   * @param {actionFunction} plugin.exec 插件对应操作
   */
  register(plugin) {
    const {
      name,
      symbol,
      priorTo = [],
      leftValIsOptional = false,
      exec,
    } = plugin;

    if (typeof this.plugins[name] !== 'undefined')
      throw new Error(
        `插件对应名称已被 {${name}:${this.plugins[name].symbol}} 注册`,
      );
    if (name.length < 4) throw new Error('插件名称字符长度必须大于 4 ');

    if (typeof this.symbols[symbol] !== 'undefined')
      throw new Error(
        `插件对应符号已被 {${this.symbols[symbol]}:${symbol}} 注册`,
      );
    if (symbol.length > 3) throw new Error('插件对应符号字符长度不能超过 3');

    this.plugins[name] = {
      name,
      symbol,
      priorTo,
      leftValIsOptional,
      exec,
    };

    this.symbols[symbol] = name;
  },
  /**
   * 注销插件
   * @param {string} name 插件名
   */
  unregister(name) {
    if (typeof name === undefined) throw new Error(`插件 ${name} 未被注册`);
    const symbol = this.plugins[name].symbol;
    this.plugins[name] = null;
    this.symbols[symbol] = null;
  },
  /**
   * 安全精度
   * @param {number} precision 精度
   * @param  {...string} NumStrArr 数字字符串数组
   */
  safePrecision(precision, ...NumStrArr) {
    return NumStrArr.every((v) => Number.isSafeInteger(+v * 10 ** precision))
      ? precision
      : this.safePrecision(precision - 1, ...NumStrArr);
  },
  /**
   * 将数字字符串分为整数和小数部分
   * @param {string} numStr
   */
  splitDot(numStr) {
    return ('0' + numStr + '.').split('.').splice(0, 2);
  },
  /**
   * 获取安全范围内更高精度
   * @param {string} numStr1
   * @param {string} numStr2
   * @todo 判断是否是数字
   */
  betterPrecision(numStr1, numStr2) {
    const d1 = this.splitDot(numStr1)[1];
    const d2 = this.splitDot(numStr2)[1];
    const longPrecision = Math.max(d1.length, d2.length);
    return this.canUseBigInt
      ? longPrecision
      : this.safePrecision(
          longPrecision < this.precision ? this.precision : longPrecision,
          numStr1,
          numStr2,
        );
  },
  /**
   * @function
   * @param {string} numStr
   * @param {number} precision
   * @returns {(number|bigint)} 肯定是个整数
   */
  float2int:
    'BigInt' in globalThis
      ? (numStr, precision) => {
          const [integer, decimals] = ('0' + numStr).split('.');
          if (typeof decimals === 'undefined') return BigInt(numStr); // 没有小数,直接返回
          const arr = decimals.padEnd(precision, '0').split(''); // 扩充到指定位数
          arr.splice(precision); //删除超出精度的部分
          return BigInt(integer + arr.join(''));
        }
      : (numStr, precision) => Math.trunc(+numStr * 10 ** precision),
  /**
   * 执行操作
   * @param {string} actionName 执行的操作名，可以是插件名或插件对应的符号
   * @param {(number|bigint|string)} rightVal 右值，使用字符串传入左右值时，不会损失精度（存在 bigint 类型的情况下）
   * @param {(null|number|bigint|string)} leftVal 左值，不填则为当前值，主要方便跳过设置 currentValue 的操作
   * @returns {*} basicCalc 对象
   */
  exec(actionName, rightVal, leftVal = '') {
    const name = actionName.length < 4 ? this.symbols[actionName] : actionName;
    const func = this.core[name].exec || this.plugins[name].exec;

    if (leftVal === '') leftVal = this.currentValue;
    // 都为 bigint
    if (typeof rightVal === 'bigint' && typeof leftVal === 'bigint')
      this.set(String(func(leftVal, rightVal)));
    // 转换为 string 方便可能的小数计算
    if (typeof rightVal !== 'string') rightVal = String(rightVal);
    if (typeof leftVal !== 'string') leftVal = String(leftVal);

    const precision = this.betterPrecision(leftVal, rightVal);

    const result = func(
      this.float2int(leftVal || this.currentValue, precision),
      this.float2int(rightVal, precision),
    );

    // TODO 存在 bug
    if (this.canUseBigInt) {
      const intResult = func(
        BigInt(this.splitDot(leftVal || this.currentValue)[0]),
        BigInt(this.splitDot(rightVal)[0]),
      );

      this.set(insert(String(result), intResult.length - 1, '.'));
    } else {
      this.set(String(result / 10 ** precision));
    }

    return this;
  },
};

const calculator = {};
