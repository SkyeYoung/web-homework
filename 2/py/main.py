'''
Date: 2020-09-21 19:21:13
LastEditors: Skye Young
LastEditTime: 2020-09-23 10:55:12
FilePath: \程序\2\py\main.py
'''
# !/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Target: 简单爬取 www.just.edu.cn 的文章信息转换为 json
Date: 2020-09-21 19:21:13
LastEditors: Skye Young
LastEditTime: 2020-09-21 19:40:24
FilePath: \程序\2\py\main.py
"""
import json

from bs4 import BeautifulSoup, PageElement
from requests import Session
from requests.adapters import HTTPAdapter

# 要爬取的页面
URL = 'http://www.just.edu.cn'


def post2list(ele: PageElement):
    post_list = []

    headers = ele.find('div', class_='hd')('li')
    for header in headers:
        post_list.append({
            'name': header.a.text,
            'link': header.a['href'],
            'children': []
        })

    uls = ele.find('div', class_='bd')('ul')
    for i in range(len(post_list)):
        for li in uls[i]('li'):
            post_list[i]['children'].append({
                'name': ''.join(li('a')[-1].text.split()),
                'link': li('a')[-1]['href'],
                'new': True if li.img else False,
                'date': li.span.text if li.span else ''
            })

    return post_list


def main():
    """初始化 session"""
    session = Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36'})
    # 失败后最多再尝试两次（共三次）
    session.mount('http://', HTTPAdapter(max_retries=2))
    session.mount('https://', HTTPAdapter(max_retries=2))

    # 获取网页
    res = session.get(URL)
    res.encoding = 'UTF-8'
    res_html = BeautifulSoup(res.text, features='lxml')

    # 公告部分
    placard = res_html.find(id='boxtext1')
    with open('./placard-info.js', 'w', encoding='utf-8') as f:
        json.dump(post2list(placard), f, ensure_ascii=False)
    # 新闻部分
    news = res_html.find(id='boxtext2').find_next()
    with open('./news-info.js', 'w', encoding='utf-8') as f:
        json.dump(post2list(news), f, ensure_ascii=False)


if __name__ == '__main__':
    main()
