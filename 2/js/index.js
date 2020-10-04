/*
 * @Date: 2020-09-19 14:05:33
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-09-26 14:42:15
 * @FilePath: \程序\2\js\index.js
 */

import { m } from './tool.js';
import {
  navList,
  bannerLinkList,
  specialLinkList,
  normalLinkList,
  otherLinkList,
} from './info.js';
import { placardList } from './placard-info.js';
import { newsList } from './news-info.js';

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
      // 在下一帧时，设置高度
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
    children: navList.map((v) =>
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
  });
};

/**
 * 设置 banner
 */
const setBanner = () => {
  const banner = document.querySelector('div.banner');
  // 是否点击
  let isClicked = false;
  // 当前图片序号
  let currentIndex = 0;

  const showBanner = (index = 0) => {
    const navDivList = banner.querySelectorAll('div.nav > div');
    const imgLinkList = banner.querySelectorAll('div.imgs > a');
    const container = banner.querySelector('div.container');
    const firstImg = imgLinkList[0].querySelector('img');

    // 容器没有宽度时，设置容器宽度
    if (!container.style.width) {
      firstImg.addEventListener('load', function () {
        container.style.width = this.offsetWidth + 'px';
      });
    }

    // 窗口改变时，重新设置容器宽度
    // 不复用了，直接再复制一遍。。。
    window.addEventListener('resize', () => {
      container.style.width = firstImg.offsetWidth + 'px';
    });

    // 设置显示的图片
    navDivList.forEach((v, i) => {
      if (v.classList.contains('on') && i !== index) {
        v.classList.remove('on');
        imgLinkList[i].classList.remove('on');
      } else if (!v.classList.contains('on') && i === index) {
        v.classList.add('on');
        imgLinkList[i].classList.add('on');
      }
    });
  };

  m.render(banner, {
    children: [
      m(
        'div',
        { className: 'container' },
        m(
          'div',
          { className: 'imgs' },
          ...bannerLinkList.map((v) =>
            m(
              'a',
              { href: v.link },
              m('img', { src: v.src, alt: v.alt }),
              m('span', v.alt),
            ),
          ),
        ),
        m(
          'div',
          { className: 'nav' },
          ...bannerLinkList.map((v, i) =>
            m('div', {
              onclick: () => {
                showBanner(i);
                isClicked = true;
                currentIndex = i + 1;
              },
            }),
          ),
        ),
      ),
    ],
  });

  // 初始化，显示第一个 banner
  showBanner();

  // 定时切换图片
  setInterval(() => {
    if (isClicked) {
      setTimeout(() => {
        isClicked = false;
      }, 10000);
    } else {
      showBanner(currentIndex);
      currentIndex++;
      if (currentIndex == bannerLinkList.length) {
        currentIndex = 0;
      }
    }
  }, 5000);
};

/**
 * 设置公告和新闻文章列表信息
 */
const setTabLink = (parentSelector, list) => {
  const parent = document.querySelector(parentSelector);

  // 渲染文章
  const renderPosts = function (index = 0) {
    const tabLink = parent.querySelectorAll('div.tabs > a');
    // 修改 on class
    tabLink.forEach((v, i) => {
      if (v.classList.contains('on') && i !== index) {
        v.classList.remove('on');
      }

      if (!v.classList.contains('on') && i === index) {
        v.classList.add('on');
      }
    });

    // 渲染文章列表
    m.render(parent.querySelector('div.posts'), {
      children: list[index].children.map((v) =>
        m(
          'a',
          {
            href: v.link,
            title: v.name,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          m('span', { className: 'name' }, v.name),
          m('span', { className: `sign${v.new ? ' is-new' : ''}` }),
          m('span', { className: 'date' }, v.date),
        ),
      ),
    });
  };

  m.render(parent, {
    children: [
      m(
        'div',
        { className: 'tabs' },
        ...list.map((v, i) =>
          m(
            'a',
            {
              href: v.link,
              target: '_blank',
              rel: 'noopener noreferrer',
              onmouseenter: () => renderPosts(i),
            },
            v.name,
          ),
        ),
      ),
      m('div', { className: 'posts' }),
    ],
  });

  // 初始化，显示第一栏的文章
  renderPosts();
};

/**
 * 设置其它链接
 */
const setOtherLink = () => {
  m.render(document.querySelector('div.public-info > div.other'), {
    children: otherLinkList.map((v) =>
      m('a', { href: v.link }, m('img', { src: v.src })),
    ),
  });
};

/**
 * 设置特殊链接（蜂巢）
 */
const setSpecialLink = () => {
  m.render(document.querySelector('span.special-link'), {
    children: specialLinkList.map((v) =>
      m(
        'a',
        {
          href: v.link || '',
          className: `sexangle${v.name === '' ? ' fade' : ''}`,
        },
        m('div', { className: v.top || '' }),
        m('div', { className: v.bottom || '' }),
        m('span', v.name),
      ),
    ),
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
    // 导航栏
    setNav();
    // banner
    setBanner();
    // 公告栏
    setTabLink('div.placard', placardList);
    // 新闻栏
    setTabLink('div.news', newsList);
    // 其它链接栏
    setOtherLink();
    // 蜂巢链接
    setSpecialLink();
    // 普通链接
    setNormalLink();
  });
})();
