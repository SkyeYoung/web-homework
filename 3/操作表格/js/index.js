/*
 * @Date: 2020-10-15 16:32:21
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-22 23:38:43
 * @FilePath: \程序\3\操作表格\js\index.js
 */

import { m, dataListener } from './tool.js';

// 数据
let tableData = {
  row: 0,
  col: 0,
  header: [],
  data: [],
};

// 发现数据变化后的行为
let action = {
  col(prop, oldValue, newValue) {
    let { data, header } = tableData;

    if (newValue < 0) return true; // <0,不赋值
    if (newValue === 0) tableData.row = 0;
    if (oldValue === newValue - 1) {
      header.push(['th', '默认值']);
      if (tableData.row === 0) tableData.row = 1;
      else {
        data.forEach((v, i) => v.push(['td', '默认值']));
      }
    } else if (oldValue === newValue + 1) {
      header.pop();
      data.forEach((v, i) => v.pop());
    }

    renderTable();
  },
  row(prop, oldValue, newValue) {
    let { data, header } = tableData;

    if (newValue < 0) return true; // <0,不赋值
    if (oldValue === newValue - 1) {
      data.push(
        header.length > 0
          ? Array.from({ length: header.length }, () => ['td', '默认值'])
          : [],
      );
    } else if (oldValue === newValue + 1) {
      data.pop();
    }

    renderTable();
  },
};
// 监听数据变化
dataListener(tableData, action);

/**
 * 渲染表格
 */
function renderTable() {
  m.render(document.querySelector('tbody#table-header'), {
    children: [
      m(
        'tr',
        m(
          'th',
          { class: ['check'] },
          m('input', {
            type: 'checkbox',
            onclick() {
              if (this.checked) {
                document
                  .querySelector('tbody#table-content')
                  .querySelectorAll('input[type="checkbox"]')
                  .forEach((v) => (v.checked = true));
              }
            },
          }),
        ),
        m('th', { class: ['index'] }, '#'),
        ...[...tableData.header, ['th']].map(([tag, ...rest], i, arr) =>
          m(
            tag,
            {
              'data-col': i,
              className: arr.length === i + 1 ? 'gutter' : '',
              onmouseover() {
                if (!this.classList.contains('gutter')) {
                  this.setAttribute('contenteditable', true);
                }
              },
              onblur() {
                if (tableData.header[i].length > 0) {
                  tableData.header[i].splice(
                    -1,
                    1,
                    this.textContent || this.innerText,
                  );
                }
                this.removeAttribute('contenteditable');
              },
            },
            ...rest,
          ),
        ),
      ),
    ],
  });
  m.render(document.querySelector('tbody#table-content'), {
    children: tableData.data.map((tr, i) =>
      m(
        'tr',
        m(
          'td',
          { class: ['check'] },
          m('input', {
            type: 'checkbox',
            onclick() {
              document
                .querySelector('tbody#table-header')
                .querySelector('input[type="checkbox"]').indeterminate = true;
            },
          }),
        ),
        m('td', { class: ['index'] }, i + 1),
        ...tr.map(([tag, ...rest], j) =>
          m(
            tag,
            {
              'data-row': i,
              'data-col': j,
              onmouseover() {
                this.setAttribute('contenteditable', true);
              },
              onblur() {
                if (tableData.data[i][j].length > 0) {
                  tableData.data[i][j].splice(
                    -1,
                    1,
                    this.textContent || this.innerText,
                  );
                }
                this.removeAttribute('contenteditable');
              },
            },
            ...rest,
          ),
        ),
      ),
    ),
  });
}

/**
 * 渲染表格工具栏
 */
function renderTableToolBar() {
  m.render(document.querySelector('div#table-area'), {
    children: [
      m(
        'div',
        { class: ['table-toolbar', 'top'] },
        m('input', {
          type: 'button',
          value: '新增一列',
          onclick() {
            tableData.col++;
          },
        }),
        m('input', {
          type: 'button',
          value: '删除一列',
          onclick() {
            tableData.col--;
          },
        }),
        m('input', {
          class: ['btn-add-row'],
          type: 'button',
          value: '新增一行',
          onclick() {
            tableData.row++;
          },
        }),
        m('input', {
          class: ['btn-add-row'],
          type: 'button',
          value: '删除一行',
          onclick() {
            tableData.row--;
          },
        }),
        m('input', {
          class: ['btn-add-row'],
          type: 'button',
          value: '删除 N 行',
          onclick() {
            const trs = document
              .querySelector('tbody#table-content')
              .querySelectorAll('input[type="checkbox"]');

            tableData.data = tableData.data.filter((tr, i) =>
              trs[i].checked ? (trs[i].checked = false) : true,
            );
            tableData.row = tableData.data.length;
          },
        }),
      ),
      m(
        'div',
        { class: ['table-wrapper', 'header'] },
        m('table', m('tbody', { id: 'table-header' })),
      ),
      m(
        'div',
        {
          class: ['table-wrapper', 'content'],
          onscroll() {
            const header = document.querySelector('div.table-wrapper.header');
            requestAnimationFrame(() => (header.scrollLeft = this.scrollLeft));
          },
        },
        m('table', m('tbody', { id: 'table-content' })),
      ),
      m('div', { class: ['table-toolbar', 'bottom'] }),
    ],
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderTableToolBar();
  // 初始化渲染
  renderTable();
});
