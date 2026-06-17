(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const profile = window.RESUME_PROFILE || {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  const state = {
    theme: localStorage.getItem('resume-theme') || profile?.meta?.themeDefault || 'aurora',
    readMode: localStorage.getItem('resume-read-mode') === 'true',
    category: '全部',
    projectQuery: '',
    activeSection: 'about',
    commandIndex: 0,
    pointer: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    canvasRunning: false,
    reducedMotion: prefersReducedMotion,
  };

  const escapeHTML = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[char]);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const array = (value) => Array.isArray(value) ? value : [];
  const person = () => profile.person || {};
  const meta = () => profile.meta || {};
  const navItems = () => array(profile.navigation).length ? profile.navigation : [
    { label: '概览', href: '#about' }, { label: '项目', href: '#projects' }, { label: '经历', href: '#experience' }, { label: '能力', href: '#skills' }, { label: '联系', href: '#contact' },
  ];

  function safeRun(label, fn) {
    try { fn(); }
    catch (error) {
      console.warn(`[Resume OS] ${label} failed`, error);
      showToast(`${label} 初始化失败，已安全跳过`);
    }
  }

  function initials(name) {
    const value = String(name || 'OS').trim();
    if (/^[\u4e00-\u9fa5]/.test(value)) return value.slice(0, 2);
    return value.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'OS';
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value ?? '';
  }

  function setHTML(selector, html) {
    const el = $(selector);
    if (el) el.innerHTML = html;
  }

  function initMeta() {
    const p = person();
    const m = meta();
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.lang = m.language || 'zh-CN';
    document.body.classList.toggle('read-mode', state.readMode);

    const title = m.siteTitle || `${p.name || 'Resume OS'} · Portfolio`;
    const description = m.description || p.summary || 'Personal resume and portfolio website.';
    document.title = title;
    updateMeta('meta[name="description"]', 'content', description);
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[name="twitter:title"]', 'content', title);
    updateMeta('meta[name="twitter:description"]', 'content', description);
    if (m.socialPreview) {
      updateMeta('meta[property="og:image"]', 'content', m.socialPreview);
      updateMeta('meta[name="twitter:image"]', 'content', m.socialPreview);
    }

    const schema = $('#schemaPerson');
    if (schema) {
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: p.name,
        jobTitle: p.role,
        url: m.baseUrl,
        email: p.email,
        telephone: p.phone,
        address: p.location,
        sameAs: array(p.links).map((link) => link.url).filter(Boolean),
        knowsAbout: array(profile.skills).map((skill) => skill.name),
      }, null, 2);
    }

    setText('#brandName', p.name || 'Resume OS');
    setText('#brandSubtitle', m.brandSubtitle || 'Interactive Career Profile');
    setText('#brandMark', initials(p.name));
    setText('#heroRole', p.role || 'Personal Portfolio');
    setText('#heroSummary', p.summary || p.headline || 'Welcome.');
    setText('#availabilityDot', m.availability || 'Open to opportunities');
    setText('#consoleName', p.name || 'Resume OS');
    setText('#consoleHeadline', p.headline || p.summary || 'Personal brand profile.');
    setText('#contactSummary', p.summary || '欢迎联系我。');

    kineticText($('#heroName'), p.name || 'Resume OS');

    const emailCta = $('#emailCta');
    if (emailCta && p.email) emailCta.href = `mailto:${p.email}`;

    const avatar = $('#avatar');
    if (avatar) {
      if (m.avatar) avatar.innerHTML = `<img src="${escapeHTML(m.avatar)}" alt="${escapeHTML(p.name || '头像')}" loading="eager" decoding="async">`;
      else avatar.textContent = initials(p.name);
    }

    renderNavigation();
    updateReadModeButton();
  }

  function updateMeta(selector, attr, value) {
    const el = $(selector);
    if (el && value) el.setAttribute(attr, value);
  }

  function kineticText(el, text) {
    if (!el) return;
    if (state.reducedMotion || state.readMode) {
      el.textContent = text;
      return;
    }
    el.innerHTML = Array.from(String(text)).map((char, i) => {
      const printable = char === ' ' ? '&nbsp;' : escapeHTML(char);
      return `<span class="char" style="--i:${i}">${printable}</span>`;
    }).join('');
  }

  function renderNavigation() {
    const nav = navItems();
    setHTML('#topNav', nav.map((item) => `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>`).join(''));
    setHTML('#sectionRail', nav.map((item) => `<a href="${escapeHTML(item.href)}" title="${escapeHTML(item.label)}">${escapeHTML(item.label.slice(0, 1))}</a>`).join(''));
    const mobile = nav.slice(0, 4).map((item) => `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label.slice(0, 2))}</a>`).join('') + '<button type="button" id="mobileCommand">⌘K</button>';
    setHTML('#mobileDock', mobile);
  }

  function renderSummary() {
    const p = person();
    setHTML('#summaryGrid', array(profile.executiveSummary).map((item) => `
      <div class="summary-item reveal">
        <strong>${escapeHTML(item.value)}</strong>
        <span>${escapeHTML(item.label)} · ${escapeHTML(item.detail)}</span>
      </div>
    `).join(''));

    setHTML('#consoleMeta', [
      ['定位', p.role], ['地区', p.location], ['邮箱', p.email], ['电话', p.phone],
    ].filter(([, value]) => value).map(([key, value]) => `
      <div class="meta-row"><span>${escapeHTML(key)}</span><strong>${escapeHTML(value)}</strong></div>
    `).join(''));

    setHTML('#consoleLinks', array(p.links).map((link) => `
      <a class="magnetic" href="${escapeHTML(link.url)}" target="_blank" rel="noreferrer">${escapeHTML(link.label)} ↗</a>
    `).join(''));

    setHTML('#contactActions', [
      p.email ? `<a class="primary-action magnetic" href="mailto:${escapeHTML(p.email)}">发送邮件</a>` : '',
      p.phone ? `<a class="secondary-action magnetic" href="tel:${escapeHTML(p.phone)}">电话联系</a>` : '',
      ...array(p.links).map((link) => `<a class="secondary-action magnetic" href="${escapeHTML(link.url)}" target="_blank" rel="noreferrer">${escapeHTML(link.label)} ↗</a>`),
      p.email ? `<button class="secondary-action magnetic" type="button" id="copyEmail">复制邮箱</button>` : '',
    ].filter(Boolean).join(''));

    $('#copyEmail')?.addEventListener('click', () => copyToClipboard(p.email, '邮箱已复制'));
  }

  function splitStat(value) {
    const text = String(value ?? '0');
    const match = text.match(/^([\d.]+)(.*)$/);
    if (!match) return { numeric: null, suffix: text };
    return { numeric: Number(match[1]), suffix: match[2] || '' };
  }

  function renderStats() {
    setHTML('#metricGrid', array(profile.stats).map((item) => {
      const stat = splitStat(item.value);
      const value = stat.numeric === null
        ? `<strong>${escapeHTML(item.value)}</strong>`
        : `<strong class="counter" data-target="${stat.numeric}" data-suffix="${escapeHTML(stat.suffix)}"><span class="num">0</span><span>${escapeHTML(stat.suffix)}</span></strong>`;
      return `
        <article class="metric glass-card reveal">
          ${value}
          <span>${escapeHTML(item.label)}</span>
          <small>${escapeHTML(item.helper || '')}</small>
        </article>
      `;
    }).join(''));
  }

  function renderHighlights() {
    setHTML('#highlightGrid', array(profile.highlights).map((item) => `
      <article class="highlight-card glass-card reveal">
        <div>
          <p class="eyebrow">Optimized</p>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.desc)}</p>
        </div>
        <div class="chip-row">${array(item.tags).map((tag) => `<span class="chip">${escapeHTML(tag)}</span>`).join('')}</div>
      </article>
    `).join(''));
  }

  function categories() {
    return ['全部', ...new Set(array(profile.projects).map((project) => project.category).filter(Boolean))];
  }

  function renderProjectFilters() {
    setHTML('#filterTabs', categories().map((category) => `<button type="button" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`).join(''));
    $$('#filterTabs button').forEach((button) => button.addEventListener('click', () => {
      state.category = button.dataset.category || '全部';
      renderProjects();
    }));
  }

  function renderProjects() {
    const query = state.projectQuery.trim().toLowerCase();
    const projects = array(profile.projects).filter((project) => {
      const categoryMatch = state.category === '全部' || project.category === state.category;
      const haystack = [project.name, project.category, project.year, project.desc, project.impact, project.details, ...array(project.tech)]
        .join(' ').toLowerCase();
      return categoryMatch && (!query || haystack.includes(query));
    });

    $$('#filterTabs button').forEach((button) => button.classList.toggle('active', button.dataset.category === state.category));

    setHTML('#projectGrid', projects.length ? projects.map((project) => {
      const index = array(profile.projects).indexOf(project);
      return `
        <article class="project-card reveal" tabindex="0">
          <div class="project-meta"><span>${escapeHTML(project.category)}</span><span>${escapeHTML(project.year)}</span></div>
          <div>
            <h3>${escapeHTML(project.name)}</h3>
            <p>${escapeHTML(project.desc)}</p>
            <div class="project-metrics">${array(project.metrics).slice(0, 3).map((metric) => `
              <div class="project-metric"><strong>${escapeHTML(metric.v)}</strong><span>${escapeHTML(metric.k)}</span></div>
            `).join('')}</div>
            <div class="chip-row">${array(project.tech).map((tag) => `<span class="chip">${escapeHTML(tag)}</span>`).join('')}</div>
          </div>
          <button class="project-open" type="button" data-project="${index}" aria-label="查看 ${escapeHTML(project.name)} 详情">查看详情 →</button>
        </article>
      `;
    }).join('') : '<p class="glass-card" style="padding:22px">没有匹配项目。换一个关键词试试。</p>');

    $$('.project-open').forEach((button) => button.addEventListener('click', () => openProject(Number(button.dataset.project))));
    $$('.project-card').forEach((card) => card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') card.querySelector('.project-open')?.click();
    }));
    observeReveals();
  }

  function openProject(index) {
    const project = array(profile.projects)[index];
    if (!project) return;
    const modal = $('#projectModal');
    const detail = $('#projectDetail');
    if (!modal || !detail) return;
    detail.innerHTML = `
      <div class="project-detail-header">
        <div>
          <p class="eyebrow">${escapeHTML(project.category)} · ${escapeHTML(project.year)}</p>
          <h2 id="projectModalTitle">${escapeHTML(project.name)}</h2>
        </div>
        <button class="close-detail" type="button" aria-label="关闭项目详情">×</button>
      </div>
      <p>${escapeHTML(project.desc)}</p>
      <p><strong>项目影响：</strong>${escapeHTML(project.impact)}</p>
      <p><strong>深度说明：</strong>${escapeHTML(project.details || '暂无更多说明。')}</p>
      <div class="project-metrics">${array(project.metrics).slice(0, 3).map((metric) => `<div class="project-metric"><strong>${escapeHTML(metric.v)}</strong><span>${escapeHTML(metric.k)}</span></div>`).join('')}</div>
      <div class="chip-row">${array(project.tech).map((tag) => `<span class="chip">${escapeHTML(tag)}</span>`).join('')}</div>
      ${project.url && project.url !== '#' ? `<p><a class="primary-action" href="${escapeHTML(project.url)}" target="_blank" rel="noreferrer">打开项目 ↗</a></p>` : ''}
    `;
    detail.querySelector('.close-detail')?.addEventListener('click', closeProject);
    openModal(modal, detail);
  }

  function closeProject() {
    closeModal($('#projectModal'));
  }

  function renderTimeline() {
    setHTML('#timeline', array(profile.experience).map((item) => `
      <article class="timeline-item reveal">
        <div class="timeline-period">${escapeHTML(item.period)}</div>
        <div class="timeline-body glass-shell">
          <span class="timeline-type">${escapeHTML(item.type)} · ${escapeHTML(item.org)}</span>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.desc)}</p>
          <div class="chip-row">${array(item.achievements).map((tag) => `<span class="chip">${escapeHTML(tag)}</span>`).join('')}</div>
        </div>
      </article>
    `).join(''));
  }

  function renderSkills() {
    setHTML('#skillBars', array(profile.skills).map((skill) => `
      <div class="skill-row reveal">
        <div class="skill-head"><strong>${escapeHTML(skill.name)}</strong><span>${escapeHTML(skill.score)}%</span></div>
        <div class="skill-track"><div class="skill-fill" style="--score:${clamp(Number(skill.score) || 0, 0, 100)}%"></div></div>
        <div class="chip-row">${array(skill.tags).map((tag) => `<span class="chip">${escapeHTML(tag)}</span>`).join('')}</div>
      </div>
    `).join(''));
    drawRadar(1);
  }

  function renderEducation() {
    setHTML('#educationGrid', array(profile.education).map((item) => `
      <article class="education-card reveal">
        <span class="timeline-type">${escapeHTML(item.period)}</span>
        <h3>${escapeHTML(item.school)}</h3>
        <p><strong>${escapeHTML(item.degree)}</strong></p>
        <p>${escapeHTML(item.desc)}</p>
      </article>
    `).join(''));
  }

  function renderFAQ() {
    const faqs = array(profile.faq);
    setHTML('#questionList', faqs.map((item, index) => `<button type="button" data-faq="${index}">${escapeHTML(item.q)}</button>`).join(''));
    const buttons = $$('#questionList button');
    function activate(index) {
      buttons.forEach((button) => button.classList.toggle('active', Number(button.dataset.faq) === index));
      setText('#answerBox', faqs[index]?.a || '暂无回答。');
    }
    buttons.forEach((button) => button.addEventListener('click', () => activate(Number(button.dataset.faq))));
    if (buttons.length) activate(0);
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function drawRadar(progress = 1) {
    const canvas = $('#radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const host = canvas.parentElement || canvas;
    const size = Math.min(520, Math.max(300, host.clientWidth - 24 || 360));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const skills = array(profile.skills).slice(0, 8);
    const n = skills.length || 1;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.32;
    const accent = cssVar('--accent') || '#8b5cf6';
    const accent2 = cssVar('--accent-2') || '#22d3ee';

    ctx.lineWidth = 1;
    for (let ring = 1; ring <= 5; ring += 1) {
      ctx.beginPath();
      const r = (radius / 5) * ring;
      for (let i = 0; i < n; i += 1) {
        const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,.13)';
      ctx.stroke();
    }

    skills.forEach((skill, i) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const x = cx + Math.cos(a) * radius;
      const y = cy + Math.sin(a) * radius;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255,255,255,.1)';
      ctx.stroke();

      const lx = cx + Math.cos(a) * (radius + size * 0.078);
      const ly = cy + Math.sin(a) * (radius + size * 0.078);
      ctx.fillStyle = 'rgba(226,232,240,.9)';
      ctx.font = `800 ${Math.max(11, size * 0.027)}px system-ui, sans-serif`;
      ctx.textAlign = lx < cx - 6 ? 'right' : lx > cx + 6 ? 'left' : 'center';
      ctx.fillText(skill.name, lx, ly);
    });

    const gradient = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    gradient.addColorStop(0, accent);
    gradient.addColorStop(1, accent2);

    ctx.beginPath();
    skills.forEach((skill, i) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const r = radius * (clamp(Number(skill.score) || 0, 0, 100) / 100) * progress;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(124,58,237,.22)';
    ctx.fill();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function initCanvas() {
    const canvas = $('#ambientCanvas');
    if (!canvas || state.reducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = null;
    let particles = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.15 : 1.65);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = window.innerWidth < 760 ? 28 : Math.min(82, Math.max(44, Math.floor(width / 20)));
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        a: Math.random() * Math.PI * 2,
        s: Math.random() * .32 + .08,
        r: Math.random() * 2.3 + .8,
        hue: i % 3,
      }));
    }

    function palette() { return [cssVar('--accent'), cssVar('--accent-2'), cssVar('--accent-3')]; }

    function tick() {
      if (!state.canvasRunning) return;
      ctx.clearRect(0, 0, width, height);
      const colors = palette();
      for (const p of particles) {
        const dx = state.pointer.x - p.x;
        const dy = state.pointer.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = Math.min(48 / dist, .65);
        p.a += .004 + force * .012;
        p.x += Math.cos(p.a) * p.s + dx * force * .0032;
        p.y += Math.sin(p.a) * p.s + dy * force * .0032;
        if (p.x < -40) p.x = width + 40;
        if (p.x > width + 40) p.x = -40;
        if (p.y < -40) p.y = height + 40;
        if (p.y > height + 40) p.y = -40;

        const radius = p.r * (window.innerWidth < 760 ? 12 : 16);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grd.addColorStop(0, colors[p.hue] || '#8b5cf6');
        grd.addColorStop(1, 'transparent');
        ctx.globalAlpha = window.innerWidth < 760 ? .09 : .13;
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (state.canvasRunning || document.hidden || state.readMode) return;
      state.canvasRunning = true;
      tick();
    }
    function stop() {
      state.canvasRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
    }
    resize();
    start();
    window.addEventListener('resize', debounce(() => { resize(); drawRadar(1); }, 180), { passive: true });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    window.__resumeCanvasStart = start;
    window.__resumeCanvasStop = stop;
  }

  function observeReveals() {
    const targets = $$('.reveal:not(.visible), .skill-row:not(.visible)');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window) || state.reducedMotion) {
      targets.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => io.observe(el));
  }

  function observeCounters() {
    const counters = $$('.counter');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window) || state.reducedMotion || state.readMode) {
      counters.forEach((counter) => setCounter(counter, Number(counter.dataset.target || 0)));
      return;
    }
    const io = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    }, { threshold: .55 });
    counters.forEach((counter) => io.observe(counter));
  }

  function setCounter(counter, value) {
    const num = $('.num', counter);
    if (num) num.textContent = Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
  function animateCounter(counter) {
    const target = Number(counter.dataset.target || 0);
    let start = null;
    function step(now) {
      start ??= now;
      const t = clamp((now - start) / 1000, 0, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setCounter(counter, target * eased);
      if (t < 1) requestAnimationFrame(step);
      else setCounter(counter, target);
    }
    requestAnimationFrame(step);
  }

  function initPointerEffects() {
    window.addEventListener('pointermove', (event) => {
      state.pointer.x = event.clientX;
      state.pointer.y = event.clientY;
    }, { passive: true });

    if (coarsePointer || state.reducedMotion) return;
    document.addEventListener('pointermove', (event) => {
      const card = event.target.closest?.('.glass-card');
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      }
    }, { passive: true });
  }

  function initScrollState() {
    const sections = navItems().map((item) => String(item.href || '').replace('#', '')).filter(Boolean);
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight || 1;
      const progress = $('#scrollProgress');
      if (progress) progress.style.width = `${clamp((window.scrollY / max) * 100, 0, 100)}%`;
      $('#toTop')?.classList.toggle('visible', window.scrollY > 640);

      let active = sections[0] || 'about';
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 170) active = id;
      });
      state.activeSection = active;
      [...$$('#topNav a'), ...$$('#sectionRail a'), ...$$('#mobileDock a')].forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${active}`);
      });
    };
    update();
    window.addEventListener('scroll', throttle(update, 80), { passive: true });
  }

  function cycleTheme() {
    const themes = ['aurora', 'ocean', 'ember', 'graphite'];
    const current = themes.includes(state.theme) ? state.theme : themes[0];
    state.theme = themes[(themes.indexOf(current) + 1) % themes.length];
    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem('resume-theme', state.theme);
    drawRadar(1);
    showToast(`主题已切换：${state.theme}`);
  }

  function updateReadModeButton() {
    const btn = $('#readModeBtn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(state.readMode));
    btn.textContent = state.readMode ? '动' : '静';
    btn.setAttribute('aria-label', state.readMode ? '退出静读模式' : '进入静读模式');
  }

  function toggleReadMode() {
    state.readMode = !state.readMode;
    document.body.classList.toggle('read-mode', state.readMode);
    localStorage.setItem('resume-read-mode', String(state.readMode));
    updateReadModeButton();
    if (state.readMode) window.__resumeCanvasStop?.();
    else window.__resumeCanvasStart?.();
    showToast(state.readMode ? '已进入静读模式' : '已退出静读模式');
  }

  function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: state.reducedMotion || state.readMode ? 'auto' : 'smooth', block: 'start' });
  }

  function buildCommands() {
    const p = person();
    const commands = [
      { title: '联系我', subtitle: p.email || 'Contact', action: () => { if (p.email) location.href = `mailto:${p.email}`; } },
      { title: '复制邮箱', subtitle: p.email || '', action: () => copyToClipboard(p.email, '邮箱已复制') },
      { title: '切换主题', subtitle: 'theme / color', action: cycleTheme },
      { title: state.readMode ? '退出静读模式' : '进入静读模式', subtitle: 'read mode', action: toggleReadMode },
      { title: '打印 / 保存 PDF', subtitle: 'print / pdf', action: () => window.print() },
      ...navItems().map((item) => ({ title: `跳转：${item.label}`, subtitle: item.href, action: () => scrollToId(item.href.replace('#', '')) })),
    ];
    array(profile.projects).forEach((project, index) => commands.push({
      title: project.name,
      subtitle: `${project.category} · ${array(project.tech).join(' / ')}`,
      action: () => { scrollToId('projects'); setTimeout(() => openProject(index), 250); },
    }));
    array(profile.skills).forEach((skill) => commands.push({ title: skill.name, subtitle: array(skill.tags).join(' / '), action: () => scrollToId('skills') }));
    return commands.filter((cmd) => cmd.title);
  }

  function initCommandPalette() {
    const modal = $('#commandModal');
    const input = $('#commandInput');
    const results = $('#commandResults');
    if (!modal || !input || !results) return;
    let commands = buildCommands();

    function close() {
      closeModal(modal);
      input.value = '';
      state.commandIndex = 0;
    }
    function open() {
      commands = buildCommands();
      openModal(modal, input);
      render(commands);
    }
    function filtered() {
      const query = input.value.trim().toLowerCase();
      if (!query) return commands;
      return commands.filter((cmd) => `${cmd.title} ${cmd.subtitle}`.toLowerCase().includes(query));
    }
    function render(list) {
      state.commandIndex = clamp(state.commandIndex, 0, Math.max(0, list.length - 1));
      results.innerHTML = list.length ? list.map((cmd, index) => `
        <button type="button" class="command-result" data-index="${index}" aria-selected="${index === state.commandIndex}">
          <strong>${escapeHTML(cmd.title)}</strong><small>${escapeHTML(cmd.subtitle)}</small>
        </button>
      `).join('') : '<p class="command-result">没有匹配结果。</p>';
      $$('.command-result', results).forEach((button) => button.addEventListener('click', () => {
        const cmd = filtered()[Number(button.dataset.index)];
        close();
        cmd?.action();
      }));
    }

    $('#openCommand')?.addEventListener('click', open);
    $('#mobileCommand')?.addEventListener('click', open);
    $('#commandBackdrop')?.addEventListener('click', close);
    input.addEventListener('input', () => { state.commandIndex = 0; render(filtered()); });

    document.addEventListener('keydown', (event) => {
      const isCommand = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      if (isCommand) { event.preventDefault(); modal.classList.contains('open') ? close() : open(); }
      if (event.key === 'Escape') {
        if (modal.classList.contains('open')) close();
        if ($('#projectModal')?.classList.contains('open')) closeProject();
      }
      if (!modal.classList.contains('open')) return;
      const list = filtered();
      if (event.key === 'ArrowDown') { event.preventDefault(); state.commandIndex = clamp(state.commandIndex + 1, 0, list.length - 1); render(list); }
      if (event.key === 'ArrowUp') { event.preventDefault(); state.commandIndex = clamp(state.commandIndex - 1, 0, list.length - 1); render(list); }
      if (event.key === 'Enter') { event.preventDefault(); const cmd = list[state.commandIndex]; close(); cmd?.action(); }
    });
  }

  function openModal(modal, focusTarget) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add(modal.id === 'commandModal' ? 'command-open' : 'modal-open');
    requestAnimationFrame(() => focusTarget?.focus?.());
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open', 'command-open');
  }

  function initControls() {
    $('#themeBtn')?.addEventListener('click', cycleTheme);
    $('#readModeBtn')?.addEventListener('click', toggleReadMode);
    $('#spotlightBtn')?.addEventListener('click', () => scrollToId('highlights'));
    $('#printBtn')?.addEventListener('click', () => window.print());
    $('#toTop')?.addEventListener('click', () => scrollToId('top'));
    $('#projectBackdrop')?.addEventListener('click', closeProject);
    $('#projectSearch')?.addEventListener('input', (event) => { state.projectQuery = event.target.value; renderProjects(); });
    window.addEventListener('resize', debounce(() => drawRadar(1), 180), { passive: true });
  }

  async function copyToClipboard(text, message) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast(message || '已复制');
    } catch {
      showToast(text);
    }
  }

  let toastTimer;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast || !message) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2100);
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}), { once: true });
  }

  function debounce(fn, wait = 120) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait); };
  }
  function throttle(fn, wait = 80) {
    let last = 0;
    let timer;
    return (...args) => {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) { clearTimeout(timer); last = now; fn(...args); }
      else { clearTimeout(timer); timer = setTimeout(() => { last = Date.now(); fn(...args); }, remaining); }
    };
  }

  function init() {
    if (!window.RESUME_PROFILE) {
      document.body.innerHTML = '<main style="padding:2rem;color:white"><h1>缺少 profile.config.js</h1><p>请确认 profile.config.js 与 index.html 位于同一目录。</p></main>';
      return;
    }
    safeRun('Meta', initMeta);
    safeRun('Summary', renderSummary);
    safeRun('Stats', renderStats);
    safeRun('Highlights', renderHighlights);
    safeRun('Projects', () => { renderProjectFilters(); renderProjects(); });
    safeRun('Timeline', renderTimeline);
    safeRun('Skills', renderSkills);
    safeRun('Education', renderEducation);
    safeRun('FAQ', renderFAQ);
    safeRun('Reveal', () => { observeReveals(); observeCounters(); });
    safeRun('Canvas', initCanvas);
    safeRun('Pointer', initPointerEffects);
    safeRun('Scroll', initScrollState);
    safeRun('Controls', initControls);
    safeRun('Command', initCommandPalette);
    safeRun('PWA', registerServiceWorker);
    setTimeout(() => document.body.classList.remove('is-loading'), 60);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
