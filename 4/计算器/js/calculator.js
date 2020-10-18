/*
 * @Date: 2020-10-18 19:16:04
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-18 22:31:35
 * @FilePath: \程序\4\计算器\js\calculator.js
 */

/**
 * 基础计算器
 */
const basicCalc = {
  currentValue: 0,
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
      exec: (leftVal, rightVal) => leftVal - rightVal,
    },
    multiply: {
      name: 'multiply',
      symbol: '×',
      priorTo: ['+', '-'],
      exec: (leftVal, rightVal) => leftVal * rightVal,
    },
    division: {
      name: 'division',
      symbol: '÷',
      priorTo: ['+', '-'],
      exec: (leftVal, rightVal) => leftVal / rightVal,
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
  },
  /**
   * 设置值
   * @param {number} value 值
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
   * @function
   * @param {Object} plugin 插件
   * @param {string} plugin.name 插件名，限制字符长度 4 以上
   * @param {string} plugin.symbol 插件对应的符号，限制字符长度 1~3
   * @param {string[]} plugin.priorTo=[] 插件对应操作的优先级（算术优先级）
   * @param {actionFunction} plugin.exec 插件对应操作
   */
  register(plugin) {
    const { name, symbol, priorTo = [], exec } = plugin;

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
   * 执行操作
   * @param {string} actionName 行为名，可以是插件名或插件对应的符号
   * @param {number} rightVal 右值
   * @param {(null|number)} leftVal 左值，不填则为当前值，主要方便跳过设置值的操作
   * @returns 当前对象
   */
  exec(actionName, rightVal, leftVal = null) {
    const name = actionName.length < 4 ? this.symbols[actionName] : actionName;
    const func = this.core[name].exec || this.plugins[name].exec;
    this.set(func(leftVal || this.currentValue, rightVal));
    return this;
  },
};
