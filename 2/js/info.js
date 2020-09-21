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

// 特殊链接列表（六边形中的）
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
    name: '',
  },
  {
    name: '英文网站',
    link: '#',
    top: 'light',
    bottom: 'light',
  },
  {
    name: '',
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

export { navList, specialLinkList, normalLinkList };
