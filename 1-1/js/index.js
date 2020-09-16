/*
 * @Date: 2020-09-12 20:45:58
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-09-16 20:16:55
 * @FilePath: \程序\1-1\js\index.js
 */

import { createCode, validateCode, validateNone } from "./code.js";
import { m } from "./tool.js";
import { homepage, game } from "./imginfo.js";

(function IIFE() {
  /**
   * 返回选项 HTML 字符串
   * 这里采用传统的 DOM 操作
   * @param {number} value 值
   * @param {number} start 起始值
   * @param {number} selectedValue 需要选中的值，默认空
   */
  const optionHTML = (value, start, selectedValue = null) => {
    const result = value + start;

    return `<option value='${result}'${
      selectedValue === result ? " selected" : ""
    }>${result}</option>`;
  };

  /**
   * 渲染消息提示
   * @param {object} attr 标签属性
   * @param {string} inner 标签内文字
   */
  const renderPopup = (attr, inner) =>
    m(
      "div",
      Object.assign(
        {},
        {
          className: "popup",
          onanimationend: function animationEndAction() {
            // 先固定状态，方便后面的动画
            this.classList.add("show");

            // 先添加退出动画
            setTimeout(() => {
              this.style.transition = "all 0.4s";
              this.classList.remove("show");
              // 再移除
              setTimeout(() => {
                this.remove();
              }, 1000);
            }, 2000);
          },
        },
        attr
      ),
      inner
    );

  /**
   * 渲染图片链接
   * @param {{string, string}} param0 图片信息
   */
  const renderImgLink = ({ name, link }) =>
    m(
      "a",
      { className: "img-link", href: "#" },
      m("img", { src: link, alt: name }),
      m("div", name)
    );

  /**
   * 设置日历相关数据和事件
   */
  const setCalender = () => {
    const year = document.querySelector("select#year");
    const month = document.querySelector("select#month");
    const day = document.querySelector("select#day");
    // 当前时间
    const now = new Date();

    // 设置年份选项，为从当年向前 100 年
    year.innerHTML += new Array(100)
      .fill(0)
      .map((v, i) =>
        optionHTML(i, now.getFullYear() - 100 + 1, now.getFullYear())
      )
      .join("");

    // 设置月份选项
    month.innerHTML += new Array(12)
      .fill(0)
      .map((v, i) => optionHTML(i, 1, now.getMonth() + 1))
      .join("");

    // 设置天数选项
    day.innerHTML += new Array(31)
      .fill(0)
      .map((v, i) => optionHTML(i, 1, now.getDay()))
      .join("");

    const changeDateAction = () => {
      // 获取选中的那年那月的天数
      const current_year = year.options[year.selectedIndex].value;
      const current_month = month.options[month.selectedIndex].value;
      const current_date_count = new Date(
        current_year,
        current_month,
        0
      ).getDate();

      // 设置是否显示
      const days = day.querySelectorAll("option");
      days.forEach((element) => {
        element.style.display =
          parseInt(element.value) <= current_date_count ? "block" : "none";
      });
    };

    // 根据年份和月份修改当月天数
    year.addEventListener("change", changeDateAction);
    month.addEventListener("change", changeDateAction);
  };

  /**
   * 设置状态数据和事件
   */
  const setStatus = () => {
    const status = document.querySelector("select#status");
    const statusList = [
      "正在上学",
      "正在上班",
      "还在待业",
      "还在啃老",
      "准备修仙",
    ];
    status.innerHTML += statusList
      .map((v) => optionHTML(v, "", statusList[0]))
      .join("");
  };

  /**
   * 设置验证码
   */
  const setCode = () => {
    const refresh = document.querySelector("#refresh");
    // 初始化时创建一个验证码
    createCode();
    // 点击 refresh 时，更新验证码
    refresh.addEventListener("click", (event) => {
      event.preventDefault();
      createCode();
    });
  };

  /**
   * 提交表单操作
   */
  const setForm = () => {
    // 表单提交检测
    const form = document.querySelector("form#register");
    // 键对应文字
    const keyTextMap = new Map([
      ["email", "邮件"],
      ["pass", "密码"],
      ["name", "姓名"],
      ["sex", "性别"],
      ["year", "年"],
      ["month", "月"],
      ["day", "日"],
      ["status", "状态"],
      ["code", "验证码"],
    ]);

    // 表单提交事件
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      // 表单数据
      const data = new FormData(form);
      // 表单数据转化为数组
      const dataArr = [];
      data.forEach((v, k) => dataArr.push([k, v]));

      // 从数组中过滤出未通过检测的值
      const checkArr = dataArr.filter(
        (v) => validateNone(v[1]) || (v[0] === "code" && !validateCode(v[1]))
      );

      //检查是否存在未填写或错误的信息，并渲染相应消息提示
      m.render(document.querySelector("#popup"), {
        children:
          checkArr.length > 0 // 存在未通过检测的数据
            ? [
                ...checkArr.map((v, i) =>
                  renderPopup(
                    {
                      style: `color: var(--warn-color); animation-delay: ${
                        (i + 1) * 100
                      }ms;`,
                    },
                    v[0] === "code" && !validateNone(v[1])
                      ? "验证码错误，请重新输入。"
                      : `请输入${keyTextMap.get(v[0])}。`
                  )
                ),
              ]
            : [
                renderPopup(
                  {
                    style: `color: var(--info-color);`,
                  },
                  `${data.get("name")}已成功注册，即将跳转...`
                ),
              ],
      });
    });
  };

  const setHotLink = () => {
    m.render(document.querySelector(".hot-homepage > span"), {
      children: [...homepage.map((v) => renderImgLink(v))],
    });

    m.render(document.querySelector(".hot-game > span"), {
      children: [...game.map((v) => renderImgLink(v))],
    });
  };

  /**
   * DOM 加载完成后处理事件
   */
  window.addEventListener("DOMContentLoaded", () => {
    // 设置出生日期数据
    setCalender();
    // 设置个人状态数据
    setStatus();
    // 验证码只是用来模拟的……其实没啥用
    setCode();
    // 提交表单也是模拟
    setForm();
    // 渲染热门游戏和公共主页
    setHotLink();
  });
})();
