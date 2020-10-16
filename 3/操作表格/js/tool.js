/*
 * @Date: 2020-09-13 10:04:06
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-17 00:49:49
 * @FilePath: \程序\3\4\js\tool.js
 */

/**
 * 获取随机 HSL 数组
 */
const getRandomHSL = () => [Math.random(), Math.random(), Math.random()];

/**
 * 获取不重复、可视度较高的 HSL 颜色数组
 * @param {number} length 生成个数
 */
const getRandomHSLArr = (length) => {
  const HSLArr = [];
  for (let i = 0; i < length; i++) {
    let ret = getRandomHSL();

    // 颜色相邻颜色差异须大于 0.25
    if (i > 0 && Math.abs(ret[0] - HSLArr[i - 1][0]) < 0.25) {
      i--;
      continue; // 重新获取随机色
    }
    ret[1] = 0.7 + ret[1] * 0.2; // [0.7 - 0.9] 排除过灰颜色
    ret[2] = 0.4 + ret[2] * 0.4; // [0.4 - 0.8] 排除过亮过暗色

    // 数据转化到小数点后两位，再乘 100
    ret = ret.map(function (item) {
      return parseFloat(item.toFixed(2)) * 100;
    });

    HSLArr.push(`hsl(${ret[0]}, ${ret[1]}%, ${ret[2]}%)`);
  }

  return HSLArr;
};

/**
 * 返回随机正负数
 */
const getRandomSign = () => (Math.random() < 0.5 ? -1 : 1);

/**
 * 33行 React
 * 因为不能写出更短的了，所以直接用了人家的原版
 * https://github.com/leontrolski/leontrolski.github.io/blob/master/33-line-react.js
 * @param  {...any} args
 */
const m = (...args) => {
  let [attrs, [head, ...tail]] = [{}, args];
  let [tag, ...classes] = head.split('.');
  if (tail.length && !m.isRenderable(tail[0])) [attrs, ...tail] = tail;
  if (attrs.class) classes = [...classes, ...attrs.class];
  attrs = { ...attrs };
  delete attrs.class;
  const children = [];
  const addChildren = (v) =>
    v === null
      ? null
      : Array.isArray(v)
      ? v.map(addChildren)
      : children.push(v);
  addChildren(tail);
  return { __m: true, tag: tag || 'div', attrs, classes, children };
};
m.isRenderable = (v) =>
  v === null ||
  ['string', 'number'].includes(typeof v) ||
  v.__m ||
  Array.isArray(v);
m.update = (el, v) => {
  if (!v.__m) return el.data === `${v}` || (el.data = v);
  for (const name of v.classes)
    if (!el.classList.contains(name)) el.classList.add(name);
  for (const name of el.classList)
    if (!v.classes.includes(name)) el.classList.remove(name);
  for (const name of Object.keys(v.attrs)) {
    if (el[name] !== v.attrs[name]) el[name] = v.attrs[name];
    // 添加此行用于解决自定义属性不能绑定的问题。。。照理说不该有这个问题
    if (name.startsWith('data-')) el.setAttribute(name, v.attrs[name]);
  }

  for (const { name } of el.attributes)
    if (!Object.keys(v.attrs).includes(name) && name !== 'class')
      el.removeAttribute(name);
};
m.makeEl = (v) =>
  v.__m ? document.createElement(v.tag) : document.createTextNode(v);
m.render = (parent, v) => {
  const olds = parent.childNodes || [];
  const news = v.children || [];
  for (const _ of Array(Math.max(0, olds.length - news.length)))
    parent.removeChild(parent.lastChild);
  for (const [i, child] of news.entries()) {
    let el = olds[i] || m.makeEl(child);
    if (!olds[i]) parent.appendChild(el);
    const mismatch = (el.tagName || '') !== (child.tag || '').toUpperCase();
    if (mismatch) (el = m.makeEl(child)) && parent.replaceChild(el, olds[i]);
    m.update(el, child);
    m.render(el, child);
  }
};

/**
 * 对象监听器
 * @param {object} obj - 对象
 * @param {(string|Symbol)} key - 键
 * @param {*} value - 值
 * @param {(object|Function)} action - 函数或包含函数的对象，用于监听到数据变化时执行一些动作。
 */
const objectListener = (obj, key, value, action) => {
  // 递归
  dataListener(value, action);

  obj[key] = new Proxy(value, {
    set(target, property, value, receiver) {
      if (property !== 'length' && typeof action === 'function') {
        if (action(property, value)) return;
      }
      return Reflect.set(...arguments);
    },
  });
};

/**
 * 非对象监听器
 * @param {object} obj - 对象
 * @param {(string|Symbol)} key - 键
 * @param {*} value - 值
 * @param {(object|Function)} action - 函数或包含函数的对象，用于监听到数据变化时执行一些动作。
 */
const basicListener = (obj, key, value, action) => {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: false,
    get() {
      return value;
    },
    set(newValue) {
      if (value === newValue) return;
      if (typeof action === 'function') {
        if (action(key, value, newValue)) return;
      }
      value = newValue;
    },
  });
};

/**
 * 数据监听器
 */
const dataListener = (data, action) => {
  if (typeof data === 'object' && data.toString() === '[object Object]') {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'object') {
          objectListener(
            data,
            key,
            data[key],
            typeof action === 'object' && action[key],
          );
        } else {
          basicListener(
            data,
            key,
            data[key],
            typeof action === 'object' && action[key],
          );
        }
      }
    }
  }
};

export { getRandomHSLArr, getRandomSign, m, dataListener };
