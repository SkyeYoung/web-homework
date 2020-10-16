/*
 * @Date: 2020-10-15 16:32:21
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-10-17 02:18:28
 * @FilePath: \程序\3\4\js\index.js
 */

import { m, dataListener } from './tool.js';

const defaultTd = ['td', '默认值'];

let tableData = {
  row: 0,
  col: 0,
  header: [],
  data: [],
};

let action = {
  col(prop, oldValue, newValue) {
    let data = tableData.data;
    let header = tableData.header;
    if (newValue < 0) return true; // <0,不赋值
    if (newValue === 0) tableData.row = 0;
    if (oldValue === newValue - 1) {
      header.push(['th', '默认值']);
      if (tableData.row === 0) tableData.row = 1;
      else {
        data.forEach((v, i) => v.push(v[-1] || defaultTd.slice()));
      }
    } else if (oldValue === newValue + 1) {
      header.pop();
      data.forEach((v, i) => v.pop());
    }

    renderTable();
  },
  row(prop, oldValue, newValue) {
    let data = tableData.data;

    if (newValue < 0) return true; // <0,不赋值
    if (oldValue === newValue - 1) {
      data.push(
        tableData.header.length > 0
          ? new Array(tableData.header.length).fill(defaultTd.slice())
          : [],
      );
    } else if (oldValue === newValue + 1) {
      data.pop();
    }

    renderTable();
  },
};
dataListener(tableData, action);

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
                  .forEach((v) => {
                    v.checked = true;
                  });
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
                this.setAttribute('contenteditable', true);
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

function renderTableToolBar() {
  m.render(document.querySelector('div#table-area'), {
    children: [
      m(
        'div',
        { class: ['table-toolbar', 'top'] },
        m('input', {
          type: 'button',
          value: '新增一列',
          onclick: () => tableData.col++,
        }),
        m('input', {
          type: 'button',
          value: '删除一列',
          onclick: () => tableData.col--,
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
        { class: ['table-wrapper', 'content'] },
        m('table', m('tbody', { id: 'table-content' })),
      ),
      m('div', { class: ['table-toolbar', 'bottom'] }),
    ],
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderTableToolBar();
  renderTable();
});
