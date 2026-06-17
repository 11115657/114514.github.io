/*
  Resume OS Final · 个人简历展示站配置
  你主要修改这个文件即可。无需 npm、无需构建，直接 GitHub Pages 可部署。
*/
window.RESUME_PROFILE = {
  meta: {
    siteTitle: 'Santopietr Folland · Resume OS',
    description: 'A performance-first, glassmorphism personal resume and portfolio website.',
    language: 'zh-CN',
    baseUrl: 'https://your-domain.example',
    themeDefault: 'aurora', // aurora | ocean | ember | graphite
    avatar: '', // 例如 './assets/avatar.jpg'；留空则使用文字头像
    socialPreview: './assets/social-preview.svg',
    availability: 'Open to high-impact opportunities',
  },

  navigation: [
    { label: '概览', href: '#about' },
    { label: '亮点', href: '#highlights' },
    { label: '项目', href: '#projects' },
    { label: '经历', href: '#experience' },
    { label: '能力', href: '#skills' },
    { label: '联系', href: '#contact' },
  ],

  person: {
    name: '你的名字',
    role: '高性能前端 / AI 产品 / 全栈工程师',
    location: 'Vancouver, Canada',
    headline: '把复杂系统做成高级、可信、可交互的产品体验。',
    summary:
      '我关注现代 Web 体验、AI 产品工程、数据可视化和复杂系统架构。这个简历站以可读性为核心，以高级动效为辅助，帮助招聘者快速理解我的能力、项目影响和职业方向。',
    email: 'your.email@example.com',
    phone: '+1 000 000 0000',
    links: [
      { label: 'GitHub', url: 'https://github.com/yourname' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/yourname' },
      { label: 'Portfolio', url: 'https://your-domain.example' },
    ],
  },

  executiveSummary: [
    { label: '工程方向', value: 'Front-end / AI Product', detail: '性能、交互、产品化落地' },
    { label: '项目类型', value: '6+', detail: 'Web、AI、数据、自动化、UX 系统' },
    { label: '核心优势', value: 'Design × Engineering', detail: '能把视觉、体验和工程稳定性合并思考' },
  ],

  stats: [
    { value: '98%', label: '性能目标', helper: '以 Lighthouse / Core Web Vitals 为上线标准' },
    { value: '12', label: '核心模块', helper: '搜索、动效、项目、PWA、SEO、打印等' },
    { value: '0', label: '运行依赖', helper: '纯静态、无框架、无构建即可部署' },
    { value: '100%', label: '响应式', helper: '桌面端和移动端独立优化' },
  ],

  highlights: [
    {
      title: '高级视觉，但不抢正文注意力',
      desc: '流体背景、玻璃层、高光和动效都被限制在信息层之外，保证招聘者能稳定阅读。',
      tags: ['Glass UI', 'Readable Motion', 'Visual Polish'],
    },
    {
      title: '性能优先',
      desc: 'Canvas 按需运行，页面隐藏自动暂停；低动效偏好自动降级，避免移动端耗电和卡顿。',
      tags: ['LCP', 'CLS', 'INP', 'Reduced Motion'],
    },
    {
      title: '完整 SEO / PWA 基础',
      desc: '包含 Open Graph、Twitter Card、JSON-LD、Manifest、Service Worker 和离线页。',
      tags: ['SEO', 'PWA', 'Metadata'],
    },
    {
      title: '可直接交付',
      desc: '包含 GitHub Actions Node 24 质量检查、无依赖校验脚本、README 和部署说明。',
      tags: ['GitHub Pages', 'Node 24', 'Quality Gate'],
    },
  ],

  skills: [
    { name: '前端工程', score: 94, tags: ['HTML', 'CSS', 'JavaScript', 'Performance'] },
    { name: '交互设计', score: 90, tags: ['Motion', 'UX', 'Accessibility'] },
    { name: 'AI 产品', score: 86, tags: ['Prompt', 'Workflow', 'Automation'] },
    { name: '系统架构', score: 84, tags: ['Modular', 'Scalable', 'Reliable'] },
    { name: '数据可视化', score: 82, tags: ['Canvas', 'Dashboard', 'Storytelling'] },
    { name: '产品表达', score: 88, tags: ['Narrative', 'Portfolio', 'Conversion'] },
  ],

  experience: [
    {
      period: '2025 — Now',
      title: '个人品牌系统 / 高性能简历网站',
      org: 'Independent Project',
      type: '产品设计 · 前端工程',
      desc:
        '设计并实现一个流体毛玻璃交互简历系统，包含可配置内容、命令面板、项目筛选、技能可视化、联系入口、SEO、PWA 和性能降级策略。',
      achievements: ['纯静态部署', '无依赖架构', '移动端独立优化', '可打印简历模板'],
    },
    {
      period: '2024 — 2025',
      title: 'AI 工作流与自动化工具',
      org: 'Project Lab',
      type: 'AI · 工具链',
      desc:
        '把重复性任务抽象为可复用工作流，提升资料整理、内容生成、项目规划和交付复盘效率。',
      achievements: ['流程标准化', '结构化输出', '质量校验', '效率提升'],
    },
    {
      period: '2023 — 2024',
      title: '交互式数据界面与作品集系统',
      org: 'Design Engineering',
      type: 'Web · Data · UX',
      desc:
        '围绕复杂信息可视化、响应式布局和前端动效进行工程实践，强调信息密度、可读性和性能之间的平衡。',
      achievements: ['数据可视化', '组件化设计', '体验优化', '性能优化'],
    },
  ],

  projects: [
    {
      name: 'Resume OS Final',
      category: 'Web',
      year: '2026',
      desc:
        '企业级质量的个人简历展示站：高级视觉、性能优先、SEO/PWA、项目筛选、技能可视化、键盘命令和打印优化。',
      tech: ['HTML', 'CSS', 'JavaScript', 'PWA'],
      impact: '把传统简历升级为可搜索、可展示、可部署的个人品牌系统',
      metrics: [{ k: '依赖', v: '0' }, { k: '部署', v: '静态' }, { k: '适配', v: '100%' }],
      url: '#',
      details:
        '以纯静态方式实现，支持 GitHub Pages 根目录部署。视觉层、数据层和交互层保持低耦合，同时避免过度工程化。',
    },
    {
      name: 'AI Portfolio Console',
      category: 'AI',
      year: '2026',
      desc: '面向招聘者的作品问答控制台，通过本地搜索和命令面板展示候选人的能力证据链。',
      tech: ['Search', 'Prompt', 'UX'],
      impact: '降低浏览成本，提升信息发现效率',
      metrics: [{ k: '查找', v: '快' }, { k: '信息', v: '密' }, { k: '交互', v: '轻' }],
      url: '#',
      details:
        '将项目、技能、经历和 FAQ 统一进全站搜索，让浏览者按问题探索信息，而不是被迫顺序阅读。',
    },
    {
      name: 'Performance Motion Kit',
      category: 'Design',
      year: '2025',
      desc: '一套可复用的前端动效规范，覆盖滚动、悬停、磁吸、粒子、视差与降级策略。',
      tech: ['Motion', 'CSS', 'RAF'],
      impact: '保持高级感，同时控制性能成本',
      metrics: [{ k: '动画', v: '按需' }, { k: '降级', v: '自动' }, { k: '阅读', v: '稳定' }],
      url: '#',
      details:
        '动效按优先级分层：背景氛围最低，正文阅读最高；移动端和低动效偏好自动降级。',
    },
    {
      name: 'Glass Data Dashboard',
      category: 'Data',
      year: '2025',
      desc: '用毛玻璃组件和图形化信息层级展示复杂数据，强调信息密度和可读性平衡。',
      tech: ['Canvas', 'Dashboard', 'CSS Grid'],
      impact: '将复杂数据转译为可浏览的视觉叙事',
      metrics: [{ k: '图表', v: 'Canvas' }, { k: '布局', v: 'Grid' }, { k: '可读', v: 'High' }],
      url: '#',
      details:
        '通过分层卡片、雷达图、标签和计数动画把复杂能力结构可视化，避免文字堆砌。',
    },
    {
      name: 'Responsive Career System',
      category: 'UX',
      year: '2026',
      desc: '针对桌面和移动端建立不同浏览路径：桌面看空间层次，移动端看触控效率。',
      tech: ['Responsive', 'Mobile Dock', 'Scroll Spy'],
      impact: '小屏不压缩大屏体验，而是重构交互路径',
      metrics: [{ k: '桌面', v: '沉浸' }, { k: '移动', v: '单手' }, { k: '导航', v: '智能' }],
      url: '#',
      details:
        '移动端移除复杂顶部导航，使用底部 Dock；卡片单列、按钮全宽、背景弱化，避免遮挡视野。',
    },
    {
      name: 'Readable Motion System',
      category: 'Engineering',
      year: '2026',
      desc: '将动画限制在边缘、标题和进入视野瞬间，正文区域保持稳定，提高长期阅读舒适度。',
      tech: ['A11y', 'Reduced Motion', 'LocalStorage'],
      impact: '让高级感为阅读服务，而不是抢正文注意力',
      metrics: [{ k: 'A11y', v: '优先' }, { k: '动效', v: '克制' }, { k: '打印', v: '优化' }],
      url: '#',
      details:
        '提供静读模式、prefers-reduced-motion 支持、页面隐藏时暂停 Canvas，降低资源消耗。',
    },
  ],

  education: [
    {
      school: '你的学校',
      degree: '你的专业 / 学位',
      period: '2021 — 2025',
      desc: '可填写研究方向、课程、奖项、论文、比赛或毕业设计。',
    },
    {
      school: '持续学习',
      degree: '工程实践 / 设计系统 / AI 产品',
      period: '长期',
      desc: '持续迭代个人作品集、前端性能、交互体验和复杂系统表达能力。',
    },
  ],

  faq: [
    {
      q: '这套简历站最核心的优势是什么？',
      a: '它不是单纯好看的页面，而是性能、可读性、项目证据链、SEO、PWA 和部署质量同时考虑的个人品牌展示系统。',
    },
    {
      q: '动效会不会影响阅读？',
      a: '不会。动画被限制在背景、标题和进入视野瞬间，正文区域保持稳定；静读模式和系统低动效偏好都会自动降低动画。',
    },
    {
      q: '如何部署？',
      a: '把所有文件放到 GitHub Pages 的发布分支根目录，Pages 选择该分支和 /root。无需构建。',
    },
    {
      q: '如何修改内容？',
      a: '主要修改 profile.config.js。姓名、项目、经历、技能、联系方式、链接和 SEO 基础信息都在其中。',
    },
  ],
};
