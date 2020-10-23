/*
 * @Date: 2020-10-22 00:57:24
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-23 15:52:19
 * @FilePath: \程序\4\计算器\js\component.js
 */

const dragAndDropTemplate = document.createElement('template');
dragAndDropTemplate.innerHTML = `
    <style>
    :host {
      position: absolute;
      z-index: 2;
      cursor: grab;
    }
    :host(.grabbing) {
      cursor: grabbing;
    }
    </style>
    <slot></slot>`;

class DragAndDrop extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.initContainer(this);
    shadow.appendChild(dragAndDropTemplate.content.cloneNode(true));
  }

  moveAt(ele, pageX, pageY, shiftX, shiftY) {
    ele.style.transform = `translate(${pageX - shiftX}px,${pageY - shiftY}px)`;
  }

  mousemove(ele, shiftX, shiftY) {
    return (event) => {
      this.moveAt(ele, event.clientX, event.clientY, shiftX, shiftY);
      if (!ele.classList.contains('grabbing')) ele.classList.add('grabbing');
    };
  }
  /**
   *
   * @param {HTMLElement} container
   */
  initContainer(container) {
    container.addEventListener('mousedown', function (event) {
      const layout = this.getBoundingClientRect();
      const shiftX = event.clientX - layout.left;
      const shiftY = event.clientY - layout.top;
      const docMousemove = this.mousemove(this, shiftX, shiftY);

      // 提高一丁点性能
      this.style.willChange = 'transform';

      // 在 document 中监听移动事件
      document.addEventListener('mousemove', docMousemove);
      //
      document.addEventListener('mouseup', (event) => {
        const ele = event.target;
        if (ele === container || container.contains(ele)) {
          document.removeEventListener('mousemove', docMousemove);
          container.style.willChange = null;
          if (container.classList.contains('grabbing'))
            container.classList.remove('grabbing');
        }
      });
    });

    return container;
  }
}

export { DragAndDrop };
