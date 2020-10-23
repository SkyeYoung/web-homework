/*
 * @Date: 2020-10-18 16:54:31
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-23 17:16:45
 * @FilePath: \程序\4\计算器\js\index.js
 */

import { tool, calculator } from './calculator.js';
import { DragAndDrop } from './component.js';
import { m, dataListener } from './tool.js';
import { headerBtn, calcBtn } from './button-info.js';

// 定义 DragAndDrop 组件
customElements.define('drag-drop', DragAndDrop);

// 计算器所在元素
const calcWindow = document.querySelector('drag-drop#calculator');
// 计算器要使用的数据
const calcData = {
  expr: '', // 表达式
  tempResult: '', // 临时结果（未按 = 时）
  lastResult: '', // 结果（按 = 时）
  resultHistory: [], // 结果历史
};
const action = {
  line1: '',
  line2: '',
  /**
   *
   * @param {string} prop
   * @param {string} oldValue
   * @param {string} newValue
   */
  expr(prop, oldValue, newValue) {
    // 获取两个元素
    if (action.line1 === '') action.line1 = document.querySelector('div#line1');
    if (action.line2 === '') action.line2 = document.querySelector('div#line2');

    // 将表达式设置到 line1 上
    line1.textContent = newValue;
    // 设置样式
    if (!action.line1.classList.contains('show'))
      action.line1.classList.add('show');

    try {
      const lastEle = newValue.charAt(newValue.length - 1);
      if (
        (lastEle === ')' || !tool.isOperator(lastEle)) && // 不是右括号的操作符
        !(newValue.indexOf('(') !== -1 && newValue.indexOf(')') === -1) // 括号不匹配
      ) {
        line2.textContent = calcData.tempResult = calculator.calc(newValue);
      }
    } catch (error) {
      line2.textContent = error;
      // line1.textContent = '';
    }

    adjustParent(action.line1);
    adjustParent(action.line2);
  },
  tempResult(prop, oldValue, newValue) {
    // 一般是置空的时候
    if (newValue === '') {
      action.line1.classList.add('show');
      action.line2.classList.remove('show');
    }

    adjustParent(action.line1);
    adjustParent(action.line2);
  },
  /**
   *
   * @param {string} prop
   * @param {string} oldValue
   * @param {string} newValue
   */
  lastResult(prop, oldValue, newValue) {
    action.line1.classList.remove('show');
    action.line2.classList.add('show');

    adjustParent(action.line1);
    adjustParent(action.line2);

    calcData.resultHistory.push({ expr: calcData.expr, result: newValue });
  },
};

// 监听数据变化
dataListener(calcData, action);

/**
 * 适应容器
 * @param {HTMLElement} ele 元素
 */
function adjustParent(ele) {
  ele.style.transform = '';

  const width = ele.parentElement.getBoundingClientRect().width;
  const textWidth = ele.offsetWidth + 40;
  const scale = width / textWidth;
  if (width < textWidth) {
    ele.style.transform = `scale(${scale})`;
  }
}

/**
 * 将元素移到某个位置，默认移到中间
 * @param {HTMLElement} ele 元素
 * @param {number} x
 * @param {number} y
 */
function moveAt(ele, x, y) {
  const { width, height } = ele.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.body;

  ele.style.transform = `translate(${x ?? clientWidth / 2 - width / 2}px,${
    y ?? clientHeight / 2 - height / 2
  }px)`;
}

/**
 * 清空 tempResult 和 expr
 */
function clear() {
  calcData.tempResult = '';
  calcData.expr = '';
}

/**
 * 计算器按键处理
 */
function calcProcess(event) {
  // 阻止继续向上
  event.stopPropagation();

  // 获取事件来源元素
  const ele = event.target;

  if (ele.tagName === 'INPUT') {
    const value = ele.value;
    const lastValue = calcData.expr.charAt(calcData.expr.length - 1);

    if (tool.isOperator(value)) {
      if (value === 'AC') {
        // 全部清空
        clear();
      } else if (value === 'C') {
        // 删除最后一个
        const expr = calcData.expr.substring(0, calcData.expr.length - 1);
        clear();
        calcData.expr = expr;
      } else if (value === '=') {
        calcData.lastResult = calcData.tempResult;
        calcWindow.dataset.cheer = calcData.lastResult === atob('Njc1');
      } else {
        if (calcData.lastResult === calcData.tempResult && value !== '( )') {
          clear();
          calcData.expr = calcData.lastResult + value;
        } else if (tool.isOperator(lastValue)) {
          if (value === '( )') calcData.expr += '(';
          else if (value === '.') calcData.expr += '.';
          else if (value === '-') calcData.expr += '-';
        } else {
          if (value === '( )') {
            if (lastValue === '' || calcData.expr.indexOf('(') === -1) {
              calcData.expr += '(';
            } else calcData.expr += ')';
          } else calcData.expr += value;
        }
      }
    } else {
      if (calcData.lastResult === calcData.tempResult) {
        clear();
        calcData.expr = value;
      } else {
        calcData.expr += value;
      }
    }
  }
}

// 渲染计算器
m.render(calcWindow, {
  children: [
    m(
      'div',
      {
        class: ['header'],
      },
      ...headerBtn.map((v) =>
        m('input', {
          type: 'button',
          value: v.value,
          class: v.class,
          onmousedown(event) {
            event.stopPropagation();
          },
        }),
      ),
    ),
    m(
      'div',
      {
        class: ['main'],
        onmousedown: calcProcess,
      },
      m(
        'div',
        { class: ['screen'] },
        m('div', { id: 'line1' }),
        m('div', { id: 'line2' }),
      ),
      ...calcBtn.map((v) =>
        m('input', {
          type: 'button',
          value: v.value,
          class: v.class,
          onclick: v.onclick,
        }),
      ),
    ),
  ],
});

moveAt(calcWindow);

// 文字跳动
// 不知道什么时候写的，翻出来
const charJump = document.getElementsByClassName('char-jump');
if (charJump != undefined) {
  for (let i of charJump) {
    const jumpTemSplit = i.innerText.split(''); //将文字存入数组；
    i.innerText = ''; //清空原有文字；
    for (let j of jumpTemSplit) {
      let charJumpSpan = document.createElement('span'); //创建节点；
      charJumpSpan.style.position = 'relative'; //添加样式；
      charJumpSpan.innerText = j; //添加文字；
      charJumpSpan.onmouseover = () => {
        //添加鼠标划过事件；
        charJumpSpan.style.animation = 'char-jump-ani 1.2s 1 ease-out'; //添加动画；
      };
      charJumpSpan.addEventListener('animationend', () => {
        //动画结束后，重置动画；
        charJumpSpan.style.animation = '';
      });
      i.appendChild(charJumpSpan);
    }
  }
}
