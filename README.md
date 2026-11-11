# 张靓颖 Jane Zhang · 非官方粉丝资料站

纯静态、零第三方依赖的粉丝向资料站，在线地址：**https://janez808.github.io/**

内容以公开可查证资料为准：个人档案、7 张正式录音室专辑的完整曲目与真实封面、33 首影视金曲 OST、第八张专辑先行曲动态。EP / 迷你专辑 / 现场 / 精选 / 未全辑发行的作品不计入正式专辑，但保留详情页作资料存档。

## 页面结构

| 页面 | 说明 |
| --- | --- |
| `index.html` | 首页：首屏、个人档案、正式专辑（7 张）、聆听与关注 |
| `all.html?sec=...` | 全量页：个人档案 / 正式专辑（含完整简介与厂牌） |
| `albums/album-N.html` | 21 张专辑详情页：真实封面 + 完整曲目（含时长）+ MusicAlbum 结构化数据 |
| `osts/ost-N.html` | 33 个影视金曲详情页 |
| `guide/albums.html` | 资料专题：7 张正式专辑完整曲目大全 |
| `guide/osts.html` | 资料专题：影视金曲 OST 全集 |
| `feed.xml` | RSS 2.0 订阅 |
| `sitemap.xml` / `robots.txt` | 58 个 URL，已声明 sitemap |

## 可被发现的能力

- **站内分享**：全站页面底部「分享到微博 / QQ 空间 / 复制链接」，纯外链 + 同源 `share.js`，不引第三方 SDK，兼容首页严格 CSP
- **社交卡片**：`assets/img/og-share.png`（1200×630）用于首页与全量页的 OG / Twitter 卡片；详情页用各自真实封面
- **PWA**：`manifest.webmanifest` + 192/512 图标，可添加到桌面
- **结构化数据**：首页 Person / WebSite / WebPage，专辑页 MusicAlbum + track ItemList，专题页 CollectionPage + ItemList
- **缓存版本**：所有 HTML 统一引用 `style.css?v=52`、`main.js?v=46`、`data.js?v=31`、`share.js?v=1`；改静态资源必须升位

## 目录结构

```
JaneZ808-site/
├── index.html / all.html / 404.html
├── albums/  osts/  guide/            # 静态详情页与专题页（独立 HTML，需手工同步）
├── assets/
│   ├── css/style.css                 # 全部样式（亮/暗双主题变量）
│   ├── img/                          # hero / profile / albums 真实封面 / osts / og-share / 图标
│   └── js/  data.js                  # ★ 唯一数据源，改内容只改这里
│            data-bridge.js / main.js / lrc-data.js / share.js
├── feed.xml / manifest.webmanifest / sitemap.xml / robots.txt
└── .nojekyll
```

## 维护须知

- **索引对齐铁律**：详情页文件名用 `ALBUMS` / `OSTS` 的**原始下标** `gi`，`COVER_MAP` 同下标对齐；新增作品只能追加到数组末尾，不能中间插入。
- **CSP**：`index.html` 为 `script-src 'self'`，禁止内联脚本与内联事件处理器；第三方统计/分享 SDK 需要白名单才能加载。
- 专辑曲目依据 QQ音乐数字专辑页面整理，已剔除伴奏版；发行信息经百度百科 / 新浪 / 维基百科音乐作品列表交叉核对。

## 资料来源

百度百科「张靓颖」词条、QQ音乐数字专辑页面、维基百科「张靓颖音乐作品列表」、新浪 / 环球网等公开报道、TMEA 公开信息。所有内容均为公开可查证资料，未作虚构。

## 部署

GitHub Pages，推送到 `main` 即自动发布，约 60–90 秒生效（根路径有 10 分钟 CDN 缓存）。

## 版权与非官方声明

本站为**非官方**粉丝资料整理站点，与艺人及其经纪公司无关联。专辑封面、艺人照片、歌词及曲目版权归原权利人所有，仅作资料整理与索引用途。
