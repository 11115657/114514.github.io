# Fluid Glass Resume System

这是一个可直接部署到 GitHub Pages 的现代化个人简历交互系统。

## 特点

- 纯静态：无 npm、无构建依赖、无后端
- 可配置：只改 `profile.config.js` 就能更新个人信息
- 高级 UI：流体 Canvas 背景、毛玻璃卡片、动态光晕、主题切换
- 高交互：Ctrl/⌘ + K 命令面板、项目筛选、项目搜索、FAQ 面板、技能雷达、卡片拖拽、沉浸模式
- 稳定性：兼容 GitHub Pages，包含 `.nojekyll`
- 性能策略：RAF 动画、IntersectionObserver、passive listener、prefers-reduced-motion 降级

## 文件说明

```txt
/root 或 仓库根目录
├─ index.html          页面结构
├─ styles.css          UI、动画、响应式、打印样式
├─ app.js              交互逻辑
├─ profile.config.js   你的简历数据，只改这里
├─ .nojekyll           防止 GitHub Pages Jekyll 处理静态文件
└─ README.md
```

## 使用方式

1. 把这些文件放到 GitHub Pages 指定发布目录。
2. 如果 Pages 设置为：Branch = 主要角色，Folder = /root，则把文件放进该分支的仓库根目录。
3. 修改 `profile.config.js` 中的 name、role、projects、skills、experience 等数据。
4. 提交并推送。
5. 打开 GitHub Pages 链接查看效果。

## 自定义建议

- 头像：把图片放到 `assets/avatar.jpg`，然后在 `profile.config.js` 里设置 `avatar: './assets/avatar.jpg'`
- 主题：`themeDefault` 可选 `aurora`、`ocean`、`ember`
- 项目：增加 `projects` 数组即可自动出现在搜索、筛选、命令面板中
- 技能：修改 `skills` 数组即可自动更新技能条和雷达图

## 后续可升级方向

- 接入 CMS：用 JSON 文件或 Notion API 管理内容
- 接入真实 AI：让 FAQ 变成联网或本地知识库问答
- 接入统计：用 Plausible / Umami 观察访问行为
- 组件化：迁移到 Vite + React / Vue
