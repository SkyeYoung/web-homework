/*
 * @Date: 2020-09-19 14:05:33
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-09-22 13:58:44
 * @FilePath: \程序\2\js\index.js
 */

import { m } from './tool.js';
import {
  navList,
  specialLinkList,
  normalLinkList,
  otherLinkList,
} from './info.js';

/**
 * 设置导航栏
 */
const setNav = () => {
  const nav = document.querySelector('nav');

  const mouseEnterAction = function () {
    const subMenu = this.querySelector('div.sub-menu');
    // 检测是否有子菜单
    // 并检测是否设置有 height，以减少可能存在的重复触发问题
    if (subMenu && !subMenu.style.height) {
      const height = subMenu.offsetHeight;
      subMenu.style.height = '0';
      // 在下一帧时，设置函数
      requestAnimationFrame(() => (subMenu.style.height = height + 'px'));
    }
  };

  const mouseLeaveAction = function () {
    const subMenu = this.querySelector('div.sub-menu');
    // 检测是否有子菜单
    // 并检测是否设置有 height，以减少可能存在的重复触发问题
    if (subMenu && subMenu.style.height) {
      subMenu.style.height = '';
    }
  };

  m.render(nav, {
    children: [
      ...navList.map((v) =>
        m(
          'div',
          {
            className: 'menu',
            style: `width: ${100 / (navList.length + 2)}%`,
            onmouseenter: mouseEnterAction,
            onmouseleave: mouseLeaveAction,
          },
          m('a', { href: v.link }, v.name),
          v.children
            ? m(
                'div',
                {
                  className: 'sub-menu',
                  style: `transition: height ${
                    0.1 * v.children.length
                  }s ease-in-out 0s`,
                },
                ...v.children.map((v) => m('a', { href: v.link }, v.name)),
              )
            : '',
        ),
      ),
    ],
  });
};




/**
 * 设置其它链接
 */
const setOtherLink = () => {
  m.render(document.querySelector('div.public-info > div.other'), {
    children: [
      ...otherLinkList.map((v) =>
        m('a', { href: v.link }, m('img', { src: v.src })),
      ),
    ],
  });
};

/**
 * 设置特殊链接（蜂巢）
 */
const setSpecialLink = () => {
  m.render(document.querySelector('span.special-link'), {
    children: [
      ...specialLinkList.map((v) =>
        m(
          'a',
          {
            href: v.link || '',
            className: `sexangle ${v.name === '' ? 'fade' : ''}`,
          },
          m('div', { className: v.top || '' }),
          m('div', { className: v.bottom || '' }),
          m('span', v.name),
        ),
      ),
    ],
  });
};

/**
 * 设置常用链接
 */
const setNormalLink = () => {
  m.render(document.querySelector('span.normal-link'), {
    children: [
      m('span', '常用链接：'),
      ...normalLinkList.map((v) => m('a', { href: v.link }, v.name)),
    ],
  });
};

(function IIFE() {
  window.addEventListener('DOMContentLoaded', () => {
    setNav();
    setOtherLink();
    setSpecialLink();
    setNormalLink();
  });
})();
