/*
  个人信息配置文件
  你只需要改这里，不需要碰 HTML 结构。
  支持 GitHub Pages 静态部署：分支选择你的“主要角色”，目录选择 /root 或 /。
*/
window.RESUME_PROFILE = {
  meta: {
    siteTitle: 'Santopietr Folland · Fluid Resume System',
    language: 'zh-CN',
    themeDefault: 'aurora', // aurora | ocean | ember
    avatar: '', // 可放头像链接，例如 ./assets/avatar.jpg；为空时使用文字头像
  },

  person: {
    name: '你的名字',
    role: '高性能前端 / AI 产品 / 全栈工程师',
    location: 'Vancouver, Canada',
    slogan: '把复杂系统做成顺滑、可信、可交互的体验。',
    summary:
      '我关注现代 Web 体验、数据可视化、AI 产品工程和复杂系统架构。这个简历网站不是静态展示页，而是一个可搜索、可筛选、可交互、可扩展的个人品牌系统。',
    email: 'your.email@example.com',
    phone: '+1 000 000 0000',
    links: [
      { label: 'GitHub', url: 'https://github.com/yourname' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/yourname' },
      { label: 'Portfolio', url: 'https://your-domain.com' },
    ],
  },

  stats: [
    { value: '6+', label: '核心项目' },
    { value: '3 年', label: '工程经验' },
    { value: '98%', label: '性能目标' },
    { value: '∞', label: '可扩展模块' },
  ],

  highlights: [
    '高性能动画：Canvas 流体背景 + CSS GPU 加速动效',
    '自定义数据：只改 profile.config.js 即可更新简历内容',
    '交互系统：命令面板、项目筛选、技能雷达、卡片聚焦、主题切换',
    '工程稳定：无依赖、无构建、可直接 GitHub Pages 部署',
  ],

  skills: [
    { name: '前端工程', score: 92, tags: ['HTML', 'CSS', 'JS', 'Animation'] },
    { name: '交互设计', score: 88, tags: ['Motion', 'UX', 'Design System'] },
    { name: 'AI 产品', score: 84, tags: ['Prompt', 'Workflow', 'Automation'] },
    { name: '系统架构', score: 80, tags: ['Performance', 'Modular', 'Scalable'] },
    { name: '数据可视化', score: 78, tags: ['Canvas', 'Dashboard', 'Storytelling'] },
  ],

  experience: [
    {
      period: '2025 — Now',
      title: '个人品牌系统 / 高性能简历网站',
      org: 'Independent Project',
      type: '产品设计 · 前端工程',
      desc:
        '设计并实现一个流体毛玻璃交互简历系统，包含可配置内容、命令面板、项目筛选、技能可视化、联系入口和性能降级策略。',
      achievements: ['首屏轻量化', '纯静态部署', '交互状态本地保存'],
    },
    {
      period: '2024 — 2025',
      title: 'AI 工作流与自动化工具',
      org: 'Project Lab',
      type: 'AI · 工具链',
      desc:
        '把重复性任务抽象为可复用的工作流，提升资料整理、内容生成、项目规划的效率。',
      achievements: ['流程标准化', '结构化输出', '效率提升'],
    },
  ],

  projects: [
    {
      name: 'Fluid Glass Resume OS',
      category: 'Web',
      year: '2026',
      desc:
        '现代化个人简历系统：流体背景、毛玻璃卡片、键盘命令、项目筛选、技能雷达、响应式布局。',
      tech: ['HTML', 'CSS', 'JavaScript', 'Canvas'],
      impact: '把静态简历升级为可交互个人系统',
      url: '#',
    },
    {
      name: 'AI Portfolio Console',
      category: 'AI',
      year: '2026',
      desc: '面向招聘者的作品问答控制台，通过本地 FAQ 逻辑展示候选人的能力证据链。',
      tech: ['UX', 'Prompt', 'Search'],
      impact: '降低浏览成本，提升信息密度',
      url: '#',
    },
    {
      name: 'Performance Motion Kit',
      category: 'Design',
      year: '2025',
      desc: '一套可复用的前端动效规范，覆盖滚动、悬停、磁吸、粒子、视差与降级策略。',
      tech: ['Motion', 'CSS', 'RAF'],
      impact: '保持高级感，同时控制性能成本',
      url: '#',
    },
  ],

  education: [
    {
      school: '你的学校',
      degree: '你的专业 / 学位',
      period: '2021 — 2025',
      desc: '可填写研究方向、课程、奖项或毕业设计。',
    },
  ],

  faq: [
    {
      q: '你最核心的优势是什么？',
      a: '我能把视觉体验、交互逻辑和工程稳定性放在同一个系统里考虑，而不是只做一个好看的页面。',
    },
    {
      q: '这个简历网站为什么不是普通展示页？',
      a: '它支持命令面板、搜索筛选、技能可视化、主题切换、动态聚焦和配置化数据，用户可以主动探索信息。',
    },
    {
      q: '适合投递什么岗位？',
      a: '前端工程、产品工程、AI 产品、交互设计、创意技术、个人品牌展示等岗位都可以用这套系统表达能力。',
    },
  ],
};
