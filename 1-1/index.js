(function IIFE() {
  /**
   * 返回选项 HTML 字符串
   * @param {number} value 值
   * @param {number} start 起始值
   * @param {number} selectedValue 需要选中的值，默认空
   */
  const optionHTML = (value, start, selectedValue = null) => {
    const result = value + start;

    return `<option value='${result}'${
      selectedValue === result ? "selected" : ""
    }>${result}</option>`;
  };

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
      );

    // 设置月份选项
    month.innerHTML += new Array(12)
      .fill(0)
      .map((v, i) => optionHTML(i, 1, now.getMonth() + 1));

    // 设置天数选项
    day.innerHTML += new Array(31)
      .fill(0)
      .map((v, i) => optionHTML(i, 1, now.getDay()));

    // 根据月份修改当月天数
    month.addEventListener("change", () => {
      // 获取选中的那年那月的天数
      current_year = year.options[year.selectedIndex].value;
      current_month = month.options[month.selectedIndex].value;
      current_date_count = new Date(current_year, current_month, 0).getDate();

      // 设置是否显示
      days = day.querySelectorAll("option");
      days.forEach((element) => {
        element.style.display =
          parseInt(element.value) <= current_date_count ? "block" : "none";
      });
    });
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
    status.innerHTML += statusList.map((v, i) =>
      optionHTML(v, "", statusList[0])
    );
  };

  /**
   * 创建验证码
   */
  const createCode = (codeLength = 6) => {
    const codeList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
      ""
    );

    const randomCode = new Array(codeLength)
      .fill(0)
      .map((v, i) => codeList[Math.floor(Math.random() * codeList.length)])
      .join("");

    const codeImage = document.querySelector("#code-image");
    const canvas = document.createElement("canvas");
    const { width, height } = codeImage.getBoundingClientRect();
    // 设置一些基本数据
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // 添加验证码
    const ctx = canvas.getContext("2d");
    const hslArr = getRandomHSLArr(2);
    ctx.textAlign = "center";
    ctx.fillStyle = hslArr[0];
    ctx.fillRect(0, 0, width, height);
    ctx.font = "24px Roboto Slab";
    ctx.setTransform(1, -0.12, 0.2, 1, 0, -10);
    ctx.fillStyle = hslArr[1];
    ctx.fillText(randomCode, width / 2, height);

    codeImage.innerHTML = null;
    codeImage.appendChild(canvas);

    sessionStorage.setItem("code", btoa(randomCode));
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
   * 验证验证码
   */
  const validateCode = (code4validate) => {
    const code = atob(sessionStorage.getItem("code"));
    sessionStorage.removeItem("code");
    return code === code4validate;
  };

  /**
   * DOM 加载完成后处理事件
   */
  window.addEventListener("DOMContentLoaded", () => {
    setCalender();
    setStatus();
    // 验证码只是用来模拟的……其实没啥用
    setCode();
  });
})();
