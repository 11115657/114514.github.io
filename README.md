# Resume OS Final

一个完整可直接落地的个人简历展示站：高级视觉、性能优先、SEO/PWA、项目筛选、命令面板、技能可视化、打印优化和 GitHub Actions Node 24 质量检查。

## 直接部署

将本目录所有文件放到 GitHub Pages 发布分支的根目录，然后在 GitHub：

```txt
Settings → Pages → Build and deployment
Branch：你的发布分支
Folder：/ root
Save
```

无需 npm、无需构建、无需服务器。

## 你主要修改哪里

只需要修改：

```txt
profile.config.js
```

可修改内容：

- 姓名、职位、地区、简介
- 邮箱、电话、GitHub、LinkedIn、作品集链接
- 项目、经历、技能、教育、FAQ
- SEO 标题和描述
- 默认主题
- 头像路径

头像示例：

```js
avatar: './assets/avatar.jpg'
```

然后把 `avatar.jpg` 放进 `assets/`。

## 文件结构

```txt
.
├─ index.html
├─ styles.css
├─ app.js
├─ profile.config.js
├─ sw.js
├─ offline.html
├─ site.webmanifest
├─ robots.txt
├─ sitemap.xml
├─ .nojekyll
├─ assets/
│  ├─ favicon.svg
│  └─ social-preview.svg
├─ tools/
│  └─ validate.mjs
├─ .github/workflows/
│  └─ quality.yml
├─ package.json
├─ CHANGELOG.md
└─ README.md
```

## 已完成的最终优化

### A. 性能极致优化

- 无框架、无运行时依赖、无构建步骤。
- Canvas 背景按需运行，页面隐藏时自动暂停。
- 小屏自动降低粒子密度和 devicePixelRatio。
- 支持 `prefers-reduced-motion` 和静读模式。
- 使用 IntersectionObserver 触发滚动动画和计数动画。
- 长页面 section 使用 `content-visibility` 降低渲染成本。
- 打印模式单独优化，隐藏背景和导航。
- Service Worker 缓存核心资源，支持离线回退页。

### B. 顶级视觉展示

- 流体背景、玻璃拟态、主题系统、高级渐变文字。
- 角色标题流动渐变，姓名逐字展开。
- 卡片内部鼠标高光跟随，不遮挡正文。
- 桌面端有顶部导航和右侧章节 rail。
- 移动端有底部 Dock，适合单手快速跳转。
- 项目详情弹窗、项目指标、技能雷达图、技能条动画。

### D. 可直接落地交付

- 包含 GitHub Pages 所需 `.nojekyll`。
- 包含 PWA manifest 和 Service Worker。
- 包含 SEO meta、Open Graph、Twitter Card、JSON-LD。
- 包含 GitHub Actions 质量检查。
- 包含无依赖 Node 24 校验脚本。

## 本地检查

需要 Node.js 24：

```bash
npm run check
```

只做配置和文件检查：

```bash
npm run validate
```

## 快捷键

```txt
Ctrl / ⌘ + K  打开命令面板
Esc           关闭弹窗或命令面板
Enter         打开聚焦项目卡片详情
```

## GitHub Actions Node 20 警告修复

本项目 workflow 已使用：

```yaml
uses: actions/checkout@v6
uses: actions/setup-node@v6
uses: actions/upload-artifact@v7
node-version: 24
```

并设置：

```yaml
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
```

这用于规避 Node.js 20 弃用警告，并让质量检查面向 Node.js 24。

## 上线前建议

1. 修改 `profile.config.js`。
2. 修改 `sitemap.xml` 里的域名。
3. 修改 `meta.baseUrl`。
4. 替换 `assets/social-preview.svg` 或保留默认预览图。
5. 上传到 GitHub Pages 根目录。
6. 打开页面测试桌面端、移动端、打印和命令面板。
