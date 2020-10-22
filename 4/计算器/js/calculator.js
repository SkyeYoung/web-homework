/*
 * @Date: 2020-10-18 19:16:04
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-22 23:22:09
 * @FilePath: \程序\4\计算器\js\calculator.js
 */

const canUseBigInt = 'BigInt' in globalThis;

const tool = {
  /**
   * 在字符串中插入符号
   * @param {string} str
   * @param {number} index
   * @param {*} value
   * @returns {string}
   */
  insert(str, index, value) {
    return str.slice(0, index) + value + str.slice(index);
  },
  /**
   * 在 '.' 开头的小数前补零
   * @param {string} numStr
   * @returns {string}
   */
  addZero(numStr) {
    return numStr.startsWith('.') ? '0' + numStr : numStr;
  },
  /**
   * 将数字字符串分为整数和小数部分
   * @param {string} numStr
   * @returns {string[]}
   */
  splitDot(numStr) {
    return (this.addZero(numStr) + '.').split('.').splice(0, 2);
  },
  /**
   * 安全精度
   * @param {number} precision 精度
   * @param  {...string} NumStrArr 数字字符串数组
   * @returns {number}
   */
  safePrecision(precision, ...NumStrArr) {
    return NumStrArr.every((v) => Number.isSafeInteger(+v * 10 ** precision))
      ? precision
      : this.safePrecision(precision - 1, ...NumStrArr);
  },
  /**
   * 获取安全范围内更高精度
   * @param {string} numStr1
   * @param {string} numStr2
   * @param {string} precision fallback
   * @returns {number}
   */
  betterPrecision(numStr1, numStr2, precision) {
    const d1 = this.splitDot(numStr1)[1];
    const d2 = this.splitDot(numStr2)[1];
    const longPrecision = Math.max(d1.length, d2.length);
    return canUseBigInt
      ? longPrecision
      : this.safePrecision(
          Math.max(longPrecision, precision),
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
  float2int: canUseBigInt
    ? (numStr, precision) => {
        const [integer, decimals] = (numStr.startsWith('-')
          ? ''
          : '0' + numStr
        ).split('.');
        return BigInt(
          integer +
            (typeof decimals === 'undefined'
              ? ''.padEnd(precision, '0')
              : decimals.padEnd(precision, '0')),
        );
      }
    : (numStr, precision) => Math.trunc(+numStr * 10 ** precision),
  /**
   * 是否为操作符
   * @param {*} str
   * @returns {boolean}
   */
  isOperator(str) {
    return isNaN(typeof str === 'string' ? str : String(str));
  },
  /**
   * 是否为数组
   * @param {*} variable
   */
  isArray(variable) {
    return Object.prototype.toString.call(variable) == '[object Array]';
  },
  /**
   * 非数组转换为数组
   * @param {*} variable
   * @param  {...any} rest 填充到转换后的数组中
   */
  var2Array(variable, ...rest) {
    return this.isArray(variable) ? variable : [variable, ...rest];
  },
};

/**
 * 基础计算器
 */
// FIXME 这里采用的精度处理方法存在很大的问题，实际只适用于加减乘，可能还有一点其它的简单操作
// FIXME 要真的搞好，估计得做一个类似 Decimal.js 的东西，目前无法处理的部分暂时回退到原生的 number
const basicCalc = {
  // 当前值，存储运算结果
  currentValue: '0',
  // 精度，小数点后 N 位
  precision: 6,
  // 核心计算操作，形式同插件
  core: {
    plus: {
      name: 'plus',
      symbol: '+',
      priorTo: [],
      leftValIsOptional: false,
      needProcess: true,
      exec: (leftVal, rightVal, precision) => {
        let intResult = String(
          (leftVal + rightVal) /
            (canUseBigInt ? BigInt(10 ** precision) : 10 ** precision),
        );
        intResult =
          intResult === '0' ? ''.padEnd(precision + 1, '0') : intResult;
        return [String(leftVal + rightVal), intResult];
      },
    },
    minus: {
      name: 'minus',
      symbol: '-',
      priorTo: [],
      leftValIsOptional: true,
      needProcess: true,
      exec: (leftVal, rightVal, precision) => {
        let intResult =
          (leftVal - rightVal) /
          (canUseBigInt ? BigInt(10 ** precision) : 10 ** precision);
        intResult =
          String(intResult) === '0' ? ''.padEnd(precision + 1, '0') : intResult;
        return [String(leftVal - rightVal), intResult];
      },
    },
    multiply: {
      name: 'multiply',
      symbol: '×',
      priorTo: ['+', '-'],
      leftValIsOptional: false,
      needProcess: true,
      exec: (leftVal, rightVal, precision) => {
        let intResult =
          (leftVal * rightVal) /
          (canUseBigInt
            ? BigInt((10 ** precision) ** 2)
            : (10 ** precision) ** 2);
        intResult =
          String(intResult) === '0'
            ? ''.padEnd(precision * 2 + 1, '0')
            : intResult;
        return [String(leftVal * rightVal), intResult];
      },
    },
    division: {
      name: 'division',
      symbol: '÷',
      priorTo: ['+', '-'],
      leftValIsOptional: false,
      needProcess: false,
      exec: (leftVal, rightVal, precision) => [
        leftVal / rightVal,
        leftVal / rightVal / 10 ** precision,
      ],
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
   * @param {(number|bigint)} leftVal 操作符的左值
   * @param {(number|bigint)} rightVal 操作符的右值
   * @returns {(number[]|bigint[])} 返回数据
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
      needProcess = true,
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
      needProcess,
      exec,
    };

    this.symbols[symbol] = name;
  },
  /**
   * 注销插件
   * @param {string} name 插件名
   */
  unregister(name) {
    if (typeof this.plugins[name] === 'undefined')
      throw new Error(`插件 ${name} 未被注册`);
    delete this.symbols[this.plugins[name].symbol];
    delete this.plugins[name];
  },
  /**
   * 执行操作
   * @param {string} actionName 执行的操作名，可以是插件名或插件对应的符号
   * @param {(number|bigint|string)} rightVal 右值，使用字符串传入左右值时，不会损失精度（存在 bigint 类型的情况下）
   * @param {(null|number|bigint|string)} leftVal 左值，不填则为当前值，主要方便跳过设置 currentValue 的操作
   * @returns {*} basicCalc 对象
   */
  exec(actionName, rightVal, leftVal = '') {
    const name = actionName.length < 4 ? this.symbols[actionName] : actionName;

    if (typeof name === 'undefined')
      throw new Error(`操作 ${actionName} 未被定义`);

    const action =
      (typeof this.core[name] !== 'undefined' && this.core[name]) ||
      (typeof this.plugins[name] !== 'undefined' && this.plugins[name]);
    const func = action.exec;

    // 默认为 currentValue
    if (leftVal === '')
      leftVal = action.leftValIsOptional ? '0' : this.currentValue;

    // 都为 bigint，直接操作
    if (typeof rightVal === 'bigint' && typeof leftVal === 'bigint')
      this.set(String(tool.var2Array(func(leftVal, rightVal))[0]));

    // 不适用精度处理
    if (!action.needProcess) {
      this.set(
        String(tool.var2Array(func(Number(leftVal), Number(rightVal)))[0]),
      );
    } else {
      // 转换为 string 方便可能的小数计算
      if (typeof rightVal !== 'string') rightVal = String(rightVal);
      if (typeof leftVal !== 'string') leftVal = String(leftVal);

      const precision = tool.betterPrecision(leftVal, rightVal, this.precision);
      let [result, intResult = 0] = tool.var2Array(
        func(
          tool.float2int(leftVal, precision),
          tool.float2int(rightVal, precision),
          precision,
        ),
      );
      // 再转一次防止操作函数中未做相关操作
      result = String(result);
      intResult = String(intResult);

      if (canUseBigInt) {
        if (!result.startsWith(intResult)) {
          // 在数据前添零
          if (result.startsWith('-')) {
            result = result.slice(1);
            result = result.padStart(intResult.length, '0');
            result = '-' + result;
          } else {
            result = result.padStart(intResult.length, '0');
          }
          result = tool.insert(result, result.startsWith('-') ? 2 : 1, '.');
        } else {
          result = tool.insert(
            result,
            (result.startsWith('-') ? 1 : 0) + intResult.length,
            '.',
          );
        }
        // 小数点后都是 0 也要移除
        if (result.indexOf('.') !== -1 && result.endsWith('0'))
          result = result.replace(/0+$/, '');
        // 移除尾部的 .
        if (result.endsWith('.')) result = result.replace('.', '');

        this.set(result);
      } else {
        this.set(String(result / 10 ** precision));
      }
    }

    return this;
  },
};

const calculator = {
  register: basicCalc.register.bind(basicCalc),
  unregister: basicCalc.unregister.bind(basicCalc),
  /**
   * 中缀表达式字符串转后缀表达式字符串数组
   */
  infix2suffix: (function () {
    /**
     * 将中缀表达式字符串转换为数组
     * @param {string} infixStr 中缀表达式字符串
     */
    const infixStr2Arr = (infixStr) => {
      const infixArr = [];
      infixStr.split('').forEach((v) => {
        if (v === ' ') return;

        const lastEle = infixArr[infixArr.length - 1];

        if (v === '(' || v === ')') infixArr.push(v);
        else if (v === '.') {
          infixArr.push((tool.isOperator(lastEle) ? '0' : infixArr.pop()) + v);
        } else if (!tool.isOperator(v)) {
          infixArr.push((tool.isOperator(lastEle) ? '' : infixArr.pop()) + v);
        } else if (tool.isOperator(v)) {
          if (v === lastEle) throw new Error(`运算符 ${v} 不能重复`);
          else if (
            tool.isOperator(lastEle) &&
            typeof basicCalc.symbols[lastEle + v] !== 'undefined'
          ) {
            infixArr.push(infixArr.pop() + v);
          } else {
            infixArr.push(v);
          }
        }
      });

      return infixArr;
    };

    /**
     * 检查优先级
     * @param {string} actionSym 要比较的符号
     * @param {string} comparedSym 被比较的符号
     */
    const priorTo = (actionSym, comparedSym) => {
      const name = basicCalc.symbols[actionSym];
      if (typeof name === 'undefined')
        throw new Error(`操作 ${actionSym} 未被定义`);
      const priorToArr =
        (typeof basicCalc.core[name] !== 'undefined' &&
          basicCalc.core[name].priorTo) ||
        (typeof basicCalc.plugins[name] !== 'undefined' &&
          basicCalc.plugins[name].priorTo);
      if (priorToArr.indexOf('others') !== -1) return true;
      return priorToArr.some((v) => v === comparedSym);
    };

    /**
     * v为非括号操作符时的操作
     * @param {string} v
     */
    const checkoutVal = (v) => {
      const lastEle = operatorStack[operatorStack.length - 1];
      if (
        operatorStack.length === 0 ||
        lastEle === '(' ||
        priorTo(v, lastEle)
      ) {
        operatorStack.push(v);
        return;
      } else {
        resultStack.push(operatorStack.pop());
        checkoutVal(v);
      }
    };

    // 运算符栈
    let operatorStack;
    // 转换结果栈
    let resultStack;

    /**
     * 处理过程
     * @param {string} infixStr 中缀表达式
     * @returns {string[]}
     */
    const process = (infixStr) => {
      operatorStack = [];
      resultStack = [];

      infixStr2Arr(infixStr).forEach((v) => {
        if (v === '(') {
          operatorStack.push(v);
        } else if (v === ')') {
          while (operatorStack.length > 0) {
            const ele = operatorStack.pop();
            if (ele === '(') break;
            else resultStack.push(ele);
          }
        } else if (tool.isOperator(v)) {
          checkoutVal(v);
        } else resultStack.push(v); //数字
      });

      return resultStack.concat(operatorStack.reverse());
    };

    return process;
  })(),
  /**
   * 计算后缀表达式
   * @param {string[]} suffixArr 后缀表达式字符串数组
   */
  calcSuffix(suffixArr) {
    const result = [];

    suffixArr.forEach((v) => {
      result.push(
        tool.isOperator(v)
          ? basicCalc.exec(v, result.pop(), result.pop() || 0).get() // 左值为空时默认返回 0
          : v,
      );
    });

    return result.pop();
  },

  /**
   * 计算数据
   */
  calc(str) {
    return this.calcSuffix(this.infix2suffix(str));
  },
};

export { canUseBigInt, tool, basicCalc, calculator };
