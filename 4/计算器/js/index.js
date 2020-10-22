/*
 * @Date: 2020-10-18 16:54:31
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-23 00:30:52
 * @FilePath: \程序\4\计算器\js\index.js
 */

import { tool, calculator } from './calculator.js';
import { DragAndDrop } from './component.js';
import { m, dataListener } from './tool.js';
import { headerBtn, calcBtn } from './button-info.js';

// 定义 DragAndDrop 组件
customElements.define('drag-drop', DragAndDrop);

function moveAtCenter(ele) {
  const { width, height } = ele.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.body;
  ele.style.transform = `translate(${clientWidth / 2 - width / 2}px,${
    clientHeight / 2 - height / 2
  }px)`;
}

const calcData = {
  expr: '',
  tempResult: '',
  lastResult: '',
  resultHistory: [],
};
const action = {
  /**
   *
   * @param {string} prop
   * @param {string} oldValue
   * @param {string} newValue
   */
  expr(prop, oldValue, newValue) {
    const line1 = document.querySelector('div#line1');
    const line2 = document.querySelector('div#line2');

    line1.textContent = newValue;
    if (!line1.classList.contains('show')) line1.classList.add('show');

    try {
      const lastEle = newValue.charAt(newValue.length - 1);
      if (
        (lastEle === ')' || !tool.isOperator(lastEle)) &&
        !(newValue.indexOf('(') !== -1 && newValue.indexOf(')') === -1)
      ) {
        line2.textContent = calcData.tempResult = calculator.calc(newValue);
      }
    } catch (error) {
      line2.textContent = error;
      // line1.textContent = '';
    }
  },
  /**
   *
   * @param {string} prop
   * @param {string} oldValue
   * @param {string} newValue
   */
  lastResult(prop, oldValue, newValue) {
    const line1 = document.querySelector('div#line1');
    const line2 = document.querySelector('div#line2');
    if (line1.classList.contains('show')) line1.classList.remove('show');
    if (!line2.classList.contains('show')) line2.classList.add('show');
  },
};

dataListener(calcData, action);

const calcWindow = document.querySelector('drag-drop#calculator');
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
        onmousedown(event) {
          // 阻止继续向上
          event.stopPropagation();

          // 获取事件来源元素
          const ele = event.target;

          // 添加点击动画
          ele.classList.add('clicked');
          // 结束后移除
          ele.addEventListener('transitionend', function () {
            this.classList.remove('clicked');
          });

          if (ele.tagName === 'INPUT') {
            const value = ele.value;
            const lastValue = calcData.expr.charAt(calcData.expr.length - 1);

            if (tool.isOperator(value)) {
              if (value === 'AC') {
                calcData.expr = '';
              } else if (value === 'C') {
                calcData.expr = calcData.expr.substring(
                  0,
                  calcData.expr.length - 1,
                );
              } else if (value === '=') {
                calcData.lastResult = calcData.tempResult;
              } else {
                if (tool.isOperator(lastValue)) {
                  if (value === '( )') {
                    calcData.expr += '(';
                  } else if (value === '.') {
                    calcData.expr += '.';
                  }
                } else {
                  if (value === '( )') {
                    if (lastValue === '' || calcData.expr.indexOf('(') === -1) {
                      calcData.expr += '(';
                    } else {
                      calcData.expr += ')';
                    }
                  } else {
                    calcData.expr += value;
                  }
                }
              }
            } else {
              calcData.expr += value;
            }
          }
        },
        onmouseup(event) {
          const ele = event.target;
          // ele.classList.remove('clicked');
        },
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

// 居中
moveAtCenter(calcWindow);
