(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const profile = window.RESUME_PROFILE;

  if (!profile) {
    document.body.innerHTML = '<main style="padding:2rem;color:white">缺少 profile.config.js，请确认文件已正确加载。</main>';
    return;
  }

  const state = {
    theme: localStorage.getItem('resume-theme') || profile.meta.themeDefault || 'aurora',
    activeCategory: '全部',
    projectQuery: '',
    commandIndex: 0,
    pointer: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };

  const escapeHTML = (value) =>
    String(value ?? '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }[char]));

  const initials = (name) => {
    const clean = String(name || 'FG').trim();
    if (/^[\u4e00-\u9fa5]/.test(clean)) return clean.slice(0, 2);
    return clean
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  function initMeta() {
    document.documentElement.dataset.theme = state.theme;
    document.title = profile.meta.siteTitle || `${profile.person.name} · Resume`;
    $('#brandName').textContent = profile.person.name;
    $('#brandMark').textContent = initials(profile.person.name);
    $('#heroName').textContent = profile.person.name;
    $('#heroRole').textContent = profile.person.role;
    $('#heroSummary').textContent = profile.person.summary;
    $('#consoleName').textContent = profile.person.name;
    $('#consoleSlogan').textContent = profile.person.slogan;
    $('#contactSummary').textContent = profile.person.summary;

    const avatar = $('#avatar');
    if (profile.meta.avatar) {
      avatar.innerHTML = `<img src="${escapeHTML(profile.meta.avatar)}" alt="${escapeHTML(profile.person.name)} 的头像" loading="lazy">`;
    } else {
      avatar.textContent = initials(profile.person.name);
    }

    $('#emailCta').href = `mailto:${profile.person.email}`;

    $('#consoleMeta').innerHTML = [
      ['定位', profile.person.role],
      ['地区', profile.person.location],
      ['邮箱', profile.person.email],
      ['电话', profile.person.phone],
    ]
      .map(([key, value]) => `<div class="meta-row"><span>${key}</span><strong>${escapeHTML(value)}</strong></div>`)
      .join('');

    $('#consoleLinks').innerHTML = profile.person.links
      .map((link) => `<a class="magnetic" href="${escapeHTML(link.url)}" target="_blank" rel="noreferrer">${escapeHTML(link.label)} ↗</a>`)
      .join('');

    $('#contactActions').innerHTML = [
      `<a class="primary-action magnetic" href="mailto:${escapeHTML(profile.person.email)}">发送邮件</a>`,
      `<a class="secondary-action magnetic" href="tel:${escapeHTML(profile.person.phone)}">电话联系</a>`,
      ...profile.person.links.map((link) => `<a class="secondary-action magnetic" href="${escapeHTML(link.url)}" target="_blank" rel="noreferrer">${escapeHTML(link.label)} ↗</a>`),
    ].join('');
  }

  function renderHighlights() {
    $('#statusStrip').innerHTML = profile.highlights
      .slice(0, 4)
      .map((item) => `<span class="status-pill">${escapeHTML(item)}</span>`)
      .join('');

    $('#featureList').innerHTML = profile.highlights
      .map((item, index) => `<div class="feature-item"><span>${index + 1}</span><p>${escapeHTML(item)}</p></div>`)
      .join('');
  }

  function renderStats() {
    $('#metricGrid').innerHTML = profile.stats
      .map(
        (item) => `
          <article class="metric glass-shell reveal">
            <strong>${escapeHTML(item.value)}</strong>
            <span>${escapeHTML(item.label)}</span>
          </article>
        `,
      )
      .join('');
  }

  function renderFAQ() {
    const box = $('#answerBox');
    $('#questionList').innerHTML = profile.faq
      .map((item, index) => `<button type="button" data-faq="${index}">${escapeHTML(item.q)}</button>`)
      .join('');

    const buttons = $$('#questionList button');
    const activate = (index) => {
      buttons.forEach((btn) => btn.classList.toggle('active', Number(btn.dataset.faq) === index));
      box.textContent = profile.faq[index]?.a || '暂无回答。';
    };

    buttons.forEach((btn) => btn.addEventListener('click', () => activate(Number(btn.dataset.faq))));
    if (buttons.length) activate(0);
  }

  function renderTimeline() {
    $('#timeline').innerHTML = profile.experience
      .map(
        (item) => `
          <article class="timeline-item reveal">
            <div class="timeline-period">${escapeHTML(item.period)}</div>
            <div class="timeline-body glass-shell">
              <span class="timeline-type">${escapeHTML(item.type)} · ${escapeHTML(item.org)}</span>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.desc)}</p>
              <div class="chip-row">${item.achievements.map((tag) => `<span class="chip">${escapeHTML(tag)}</span>`).join('')}</div>
            </div>
          </article>
        `,
      )
      .join('');
  }

  function projectCategories() {
    return ['全部', ...new Set(profile.projects.map((project) => project.category))];
  }

  function renderProjectFilters() {
    $('#filterTabs').innerHTML = projectCategories()
      .map((category) => `<button type="button" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`)
      .join('');

    $$('#filterTabs button').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.category;
        renderProjects();
      });
    });
  }

  function renderProjects() {
    const query = state.projectQuery.trim().toLowerCase();
    const filtered = profile.projects.filter((project) => {
      const matchCategory = state.activeCategory === '全部' || project.category === state.activeCategory;
      const haystack = [project.name, project.category, project.year, project.desc, project.impact, ...(project.tech || [])]
        .join(' ')
        .toLowerCase();
      return matchCategory && (!query || haystack.includes(query));
    });

    $$('#filterTabs button').forEach((btn) => btn.classList.toggle('active', btn.dataset.category === state.activeCategory));

    $('#projectGrid').innerHTML = filtered.length
      ? filtered
          .map(
            (project) => `
              <article class="project-card reveal" tabindex="0">
                <div class="project-meta"><span>${escapeHTML(project.category)}</span><span>${escapeHTML(project.year)}</span></div>
                <h3>${escapeHTML(project.name)}</h3>
                <p>${escapeHTML(project.desc)}</p>
                <div class="chip-row">${project.tech.map((tag) => `<span class="chip">${escapeHTML(tag)}</span>`).join('')}</div>
                <p><strong>Impact：</strong>${escapeHTML(project.impact)}</p>
                <a class="project-link" href="${escapeHTML(project.url)}" ${project.url === '#' ? '' : 'target="_blank" rel="noreferrer"'}>查看项目 →</a>
              </article>
            `,
          )
          .join('')
      : '<p class="glass-card">没有找到匹配项目。你可以换一个关键词。</p>';

    observeReveals();
  }

  function renderSkills() {
    $('#skillBars').innerHTML = profile.skills
      .map(
        (skill) => `
          <div class="skill-row">
            <div class="skill-head"><strong>${escapeHTML(skill.name)}</strong><span>${escapeHTML(skill.score)}%</span></div>
            <div class="skill-track"><div class="skill-fill" style="--score:${Math.max(0, Math.min(100, skill.score))}%"></div></div>
            <div class="chip-row">${skill.tags.map((tag) => `<span class="chip">${escapeHTML(tag)}</span>`).join('')}</div>
          </div>
        `,
      )
      .join('');

    drawRadar();
  }

  function renderEducation() {
    $('#educationGrid').innerHTML = profile.education
      .map(
        (item) => `
          <article class="education-card reveal">
            <span class="timeline-type">${escapeHTML(item.period)}</span>
            <h3>${escapeHTML(item.school)}</h3>
            <p><strong>${escapeHTML(item.degree)}</strong></p>
            <p>${escapeHTML(item.desc)}</p>
          </article>
        `,
      )
      .join('');
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function drawRadar() {
    const canvas = $('#radarCanvas');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 520;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = `${size}px`;
    canvas.style.height = 'auto';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const skills = profile.skills.slice(0, 8);
    const cx = size / 2;
    const cy = size / 2;
    const maxR = 185;
    const accent = cssVar('--accent');
    const accent2 = cssVar('--accent-2');
    const text = 'rgba(248,250,252,.88)';
    const muted = 'rgba(167,176,197,.75)';
    const n = skills.length || 1;

    ctx.lineWidth = 1;
    for (let ring = 1; ring <= 5; ring += 1) {
      ctx.beginPath();
      const r = (maxR / 5) * ring;
      for (let i = 0; i < n; i += 1) {
        const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,.12)';
      ctx.stroke();
    }

    skills.forEach((skill, i) => {
      const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const x = cx + Math.cos(angle) * maxR;
      const y = cy + Math.sin(angle) * maxR;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255,255,255,.1)';
      ctx.stroke();

      const lx = cx + Math.cos(angle) * (maxR + 36);
      const ly = cy + Math.sin(angle) * (maxR + 36);
      ctx.fillStyle = muted;
      ctx.font = '600 14px Inter, sans-serif';
      ctx.textAlign = lx < cx - 8 ? 'right' : lx > cx + 8 ? 'left' : 'center';
      ctx.fillText(skill.name, lx, ly);
    });

    const gradient = ctx.createLinearGradient(80, 80, 440, 440);
    gradient.addColorStop(0, accent);
    gradient.addColorStop(1, accent2);

    ctx.beginPath();
    skills.forEach((skill, i) => {
      const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const r = maxR * (Math.max(0, Math.min(100, skill.score)) / 100);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(124,58,237,.22)';
    ctx.fill();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();

    skills.forEach((skill, i) => {
      const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const r = maxR * (skill.score / 100);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = text;
      ctx.fill();
    });
  }

  function observeReveals() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach((el) => el.classList.add('visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    $$('.reveal:not(.visible)').forEach((el) => io.observe(el));
  }

  function initCanvas() {
    if (state.reducedMotion) return;
    const canvas = $('#fluid-canvas');
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.max(34, Math.floor(width / 22)));
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        a: Math.random() * Math.PI * 2,
        s: Math.random() * 0.45 + 0.18,
        hue: i % 3,
      }));
    };

    const colors = () => [cssVar('--accent'), cssVar('--accent-2'), cssVar('--accent-3')];

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      const palette = colors();
      particles.forEach((p) => {
        const dx = state.pointer.x - p.x;
        const dy = state.pointer.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = Math.min(48 / dist, 0.75);
        p.a += 0.006 + force * 0.025;
        p.x += Math.cos(p.a) * p.s + dx * force * 0.006;
        p.y += Math.sin(p.a) * p.s + dy * force * 0.006;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 14);
        grd.addColorStop(0, palette[p.hue]);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.globalAlpha = 0.16;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 14, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', (event) => {
      state.pointer.x = event.clientX;
      state.pointer.y = event.clientY;
    }, { passive: true });
  }

  function initGlassPointer() {
    document.addEventListener('pointermove', (event) => {
      $$('.glass-card').forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    }, { passive: true });
  }

  function initMagnetic() {
    if (state.reducedMotion) return;
    document.addEventListener('pointermove', (event) => {
      $$('.magnetic').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < 110) {
          el.style.transform = `translate3d(${dx * 0.08}px, ${dy * 0.08}px, 0)`;
        } else {
          el.style.transform = '';
        }
      });
    }, { passive: true });
    document.addEventListener('pointerleave', () => $$('.magnetic').forEach((el) => (el.style.transform = '')));
  }

  function initDragCards() {
    $$('.draggable-card').forEach((card) => {
      let dragging = false;
      let startX = 0;
      let startY = 0;
      let tx = 0;
      let ty = 0;

      card.addEventListener('pointerdown', (event) => {
        if (window.innerWidth < 980) return;
        dragging = true;
        startX = event.clientX - tx;
        startY = event.clientY - ty;
        card.setPointerCapture(event.pointerId);
      });

      card.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        tx = Math.max(-42, Math.min(42, event.clientX - startX));
        ty = Math.max(-42, Math.min(42, event.clientY - startY));
        card.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${ty * -0.04}deg) rotateY(${tx * 0.04}deg)`;
      });

      const end = () => {
        if (!dragging) return;
        dragging = false;
        tx = 0;
        ty = 0;
        card.style.transform = '';
      };
      card.addEventListener('pointerup', end);
      card.addEventListener('pointercancel', end);
    });
  }

  function buildCommands() {
    const commands = [
      { title: '联系我', subtitle: profile.person.email, action: () => (location.href = `mailto:${profile.person.email}`) },
      { title: '切换主题', subtitle: 'Aurora / Ocean / Ember', action: cycleTheme },
      { title: '进入项目区域', subtitle: 'Projects', action: () => scrollToId('projects') },
      { title: '进入经历区域', subtitle: 'Timeline', action: () => scrollToId('experience') },
      { title: '进入能力区域', subtitle: 'Skills', action: () => scrollToId('skills') },
      { title: '打印 / 保存 PDF', subtitle: '调用浏览器打印', action: () => window.print() },
    ];

    profile.projects.forEach((project) => {
      commands.push({
        title: project.name,
        subtitle: `${project.category} · ${project.tech.join(' / ')}`,
        action: () => {
          state.activeCategory = project.category;
          state.projectQuery = project.name;
          $('#projectSearch').value = project.name;
          renderProjects();
          scrollToId('projects');
        },
      });
    });

    profile.skills.forEach((skill) => {
      commands.push({ title: skill.name, subtitle: skill.tags.join(' / '), action: () => scrollToId('skills') });
    });

    return commands;
  }

  function initCommandPalette() {
    const modal = $('#commandModal');
    const input = $('#commandInput');
    const results = $('#commandResults');
    const commands = buildCommands();

    const close = () => {
      modal.classList.remove('open');
      input.value = '';
    };

    const open = () => {
      modal.classList.add('open');
      renderCommandResults(commands);
      requestAnimationFrame(() => input.focus());
    };

    const filteredCommands = () => {
      const query = input.value.trim().toLowerCase();
      if (!query) return commands;
      return commands.filter((cmd) => `${cmd.title} ${cmd.subtitle}`.toLowerCase().includes(query));
    };

    function renderCommandResults(list) {
      state.commandIndex = Math.min(state.commandIndex, Math.max(0, list.length - 1));
      results.innerHTML = list
        .map(
          (cmd, index) => `
            <button type="button" class="command-result" data-index="${index}" aria-selected="${index === state.commandIndex}">
              <strong>${escapeHTML(cmd.title)}</strong>
              <small>${escapeHTML(cmd.subtitle)}</small>
            </button>
          `,
        )
        .join('');

      $$('.command-result', results).forEach((btn) => {
        btn.addEventListener('click', () => {
          const cmd = filteredCommands()[Number(btn.dataset.index)];
          close();
          cmd?.action();
        });
      });
    }

    $('#openCommand').addEventListener('click', open);
    $('#commandBackdrop').addEventListener('click', close);

    input.addEventListener('input', () => {
      state.commandIndex = 0;
      renderCommandResults(filteredCommands());
    });

    document.addEventListener('keydown', (event) => {
      const isCommand = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      if (isCommand) {
        event.preventDefault();
        modal.classList.contains('open') ? close() : open();
      }
      if (!modal.classList.contains('open')) return;
      const list = filteredCommands();
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        state.commandIndex = Math.min(list.length - 1, state.commandIndex + 1);
        renderCommandResults(list);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        state.commandIndex = Math.max(0, state.commandIndex - 1);
        renderCommandResults(list);
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        const cmd = list[state.commandIndex];
        close();
        cmd?.action();
      }
    });
  }

  function scrollToId(id) {
    $(`#${id}`)?.scrollIntoView({ behavior: state.reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function cycleTheme() {
    const themes = ['aurora', 'ocean', 'ember'];
    const next = themes[(themes.indexOf(state.theme) + 1) % themes.length];
    state.theme = next;
    document.documentElement.dataset.theme = next;
    localStorage.setItem('resume-theme', next);
    drawRadar();
  }

  function initControls() {
    $('#themeBtn').addEventListener('click', cycleTheme);
    $('#focusMode').addEventListener('click', () => document.body.classList.toggle('focused'));
    $('#printBtn').addEventListener('click', () => window.print());
    $('#toTop').addEventListener('click', () => scrollToId('top'));
    $('#projectSearch').addEventListener('input', (event) => {
      state.projectQuery = event.target.value;
      renderProjects();
    });

    window.addEventListener('scroll', () => {
      $('#toTop').classList.toggle('visible', window.scrollY > 600);
      const sections = ['about', 'experience', 'projects', 'skills', 'contact'];
      const active = sections.findLast((id) => $(`#${id}`)?.getBoundingClientRect().top < 130) || 'about';
      $$('.nav-links a').forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
    }, { passive: true });

    window.addEventListener('resize', () => {
      drawRadar();
    }, { passive: true });
  }

  function init() {
    initMeta();
    renderHighlights();
    renderStats();
    renderFAQ();
    renderTimeline();
    renderProjectFilters();
    renderProjects();
    renderSkills();
    renderEducation();
    observeReveals();
    initCanvas();
    initGlassPointer();
    initMagnetic();
    initDragCards();
    initCommandPalette();
    initControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
