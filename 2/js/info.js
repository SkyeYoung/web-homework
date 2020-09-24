/*
 * @Date: 2020-09-19 15:26:46
 * @LastEditors: Skye Young
 * @LastEditTime: 2020-09-23 20:47:15
 * @FilePath: \程序\2\js\info.js
 */

/******************************************************************************
 * Header 部分的链接
 ******************************************************************************/
// 导航列表
const navList = [
  {
    name: '网站首页',
    link: '/',
  },
  {
    name: '新闻资讯',
    link: '#',
    children: [
      { name: '科大新闻', link: '#' },
      { name: '媒体科大', link: '#' },
      { name: '综合新闻', link: '#' },
      { name: '视频新闻', link: '#' },
      { name: '校报在线', link: '#' },
    ],
  },
  {
    name: '学校概况',
    link: '#',
    children: [
      { name: '学校简介', link: '#' },
      { name: '校史沿革', link: '#' },
      { name: '现任领导', link: '#' },
      { name: '大学章程', link: '#' },
      { name: '校区分布', link: '#' },
      { name: '校园风光', link: '#' },
    ],
  },
  {
    name: '组织机构',
    link: '#',
    children: [
      { name: '管理服务部门', link: '#' },
      { name: '教学科研单位', link: '#' },
      { name: '基层党组织', link: '#' },
    ],
  },
  {
    name: '人才培养',
    link: '#',
    children: [
      { name: '本科生教育', link: '#' },
      { name: '研究生教育', link: '#' },
      { name: '继续教育', link: '#' },
      { name: '国防生教育', link: '#' },
      { name: '网络教学', link: '#' },
    ],
  },
  {
    name: '科研工作',
    link: '#',
    children: [
      { name: '科研机构', link: '#' },
      { name: '成果专利', link: '#' },
      { name: '科技产业', link: '#' },
      { name: '学术交流', link: '#' },
      { name: '大仪共享', link: '#' },
    ],
  },
  {
    name: '学科建设',
    link: '#',
    children: [
      { name: '重点学科', link: '#' },
      { name: '学科专业', link: '#' },
    ],
  },
  {
    name: '招生就业',
    link: '#',
    children: [
      { name: '本科生招生', link: '#' },
      { name: '博硕生招生', link: '#' },
      { name: '继续教育招生', link: '#' },
      { name: '就业信息', link: '#' },
    ],
  },
  {
    name: '师资队伍',
    link: '#',
    children: [
      { name: '博导一览', link: '#' },
      { name: '人才引进', link: '#' },
    ],
  },
  {
    name: '国际交流',
    link: '#',
    children: [
      { name: '出国（境）交流', link: '#' },
      { name: '外专外教', link: '#' },
      { name: '合作办学', link: '#' },
      { name: '来华留学', link: '#' },
    ],
  },
  {
    name: '校园文化',
    link: '#',
    children: [
      { name: '校际校训', link: '#' },
      { name: '校歌', link: '#' },
      { name: '形象识别系统', link: '#' },
      { name: '宣传片', link: '#' },
      { name: '社团协会', link: '#' },
      { name: '文化理念', link: '#' },
      { name: '动漫解读', link: '#' },
    ],
  },
];

/******************************************************************************
 * Main 部分的链接
 ******************************************************************************/
// 公告和新闻因为太多放在 placard-info.js 和 news-info.js 里

// Banner 图片链接信息
const bannerLinkList = [
  {
    src: './asset/banner/1.jpg',
    link: '#',
    alt: '校长第一课',
  },
  {
    src: './asset/banner/2.jpg',
    link: '#',
    alt: '不负芳华 做奋斗的追梦人 2020级新生开启深蓝逐梦新航...',
  },
  {
    src: './asset/banner/3.png',
    link: '#',
    alt: '迎新',
  },
  {
    src: './asset/banner/4.png',
    link: '#',
    alt: '慰问信',
  },
  {
    src: './asset/banner/5.jpg',
    link: '#',
    alt: '硬核|江科大教师连续在世界名刊上发表学术论文',
  },
];

// 其它图片链接信息
const otherLinkList = [
  {
    src: './asset/link/1.jpg',
    link: '#',
    alt: '航向深蓝',
  },
  {
    src: './asset/link/2.png',
    link: '#',
    alt: '科大校友',
  },
  {
    src: './asset/link/3.png',
    link: '#',
    alt: '就业指导',
  },
  {
    src: './asset/link/4.png',
    link: '#',
    alt: '信息门户',
  },
  {
    src: './asset/link/5.png',
    link: '#',
    alt: '信息公开',
  },
  {
    src: './asset/link/6.png',
    link: '#',
    alt: '规章制度',
  },
];

/******************************************************************************
 * Footer 部分的链接
 ******************************************************************************/
// 特殊链接列表（蜂巢）
const specialLinkList = [
  {
    name: '主题网站',
    link: '#',
    top: 'dark',
    bottom: 'light',
  },
  {
    name: '校报在线',
    link: '#',
    top: 'dark',
    bottom: 'dark',
  },
  {
    name: '景荣春事迹',
    link: '#',
    top: 'dark',
    bottom: 'light',
  },
  {
    name: '宣传片',
    link: '#',
    top: 'dark',
    bottom: 'dark',
  },
  {
    name: '', // 用于占空，方便布局
  },
  {
    name: '英文网站',
    link: '#',
    top: 'light',
    bottom: 'light',
  },
  {
    name: '', // 用于占空，方便布局
  },
  {
    name: '航标灯',
    link: '#',
    top: 'light',
    bottom: 'light',
  },
];

// 常用链接列表
const normalLinkList = [
  {
    name: '融媒体投稿',
    link: '#',
  },
  {
    name: '信息公开',
    link: '#',
  },
  {
    name: '学校信箱',
    link: '#',
  },
  {
    name: '招标公开',
    link: '#',
  },
  {
    name: '教务管理',
    link: '#',
  },
  {
    name: '图书',
    link: '#',
  },
  {
    name: '学报',
    link: '#',
  },
];

export {
  navList,
  bannerLinkList,
  otherLinkList,
  specialLinkList,
  normalLinkList,
};
