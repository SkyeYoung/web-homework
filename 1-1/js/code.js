/*
 * @Date: 2020-09-13 14:05:35
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-09-14 16:14:08
 * @FilePath: \Web 作业\1-1\js\code.js
 */

import { getRandomHSLArr, getRandomSign } from "./tool.js";

/**
 * 创建验证码
 */
const createCode = (codeLength = 6) => {
  const codeList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
    ""
  );
  const codeImage = document.querySelector("#code-image");
  const { width, height } = codeImage.getBoundingClientRect();
  // 创建随机验证码
  const randomCode = new Array(codeLength)
    .fill(0)
    .map(() => codeList[Math.floor(Math.random() * codeList.length)])
    .join("");
  let canvas = codeImage.querySelector("canvas");

  // 如果不存在，则创建新元素
  if (!canvas) {
    canvas = document.createElement("canvas");
    // 设置一些基本数据
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    codeImage.innerHTML = null;
    codeImage.appendChild(canvas);
  }

  // 添加验证码
  const ctx = canvas.getContext("2d");
  const hslArr = getRandomHSLArr(2);
  ctx.resetTransform();
  ctx.textAlign = "center";
  ctx.fillStyle = hslArr[0];
  ctx.fillRect(0, 0, width, height);
  ctx.font = "24px Roboto Slab";
  ctx.setTransform(
    1,
    getRandomSign() * Math.random() * 0.2,
    getRandomSign() * Math.random() * 0.2,
    1,
    0,
    -10
  );
  ctx.fillStyle = hslArr[1];
  ctx.fillText(randomCode, width / 2, height);

  sessionStorage.setItem("code", btoa(randomCode));
};

/**
 * 验证验证码
 * @param {string} code4validate
 */
const validateCode = (code4validate) => {
  const code = atob(sessionStorage.getItem("code"));
  sessionStorage.removeItem("code");
  return code.toUpperCase() === code4validate.toUpperCase();
};

/**
 * 简单验证是否为空
 */
const validateNone = (value) => value === null || value === "" || value === 0;

export { createCode, validateCode, validateNone };
