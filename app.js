(() => {
  "use strict";

  const STORAGE_KEY = "ashfall-home-config-v2";
  const DEFAULT_CONFIG_URL = "./config/ashfall-home-config.json";
  const isLocalDev = location.protocol === "file:" || ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(location.hostname);
  const MAX_HISTORY = 40;
  const MAX_SOURCE_IMAGE_BYTES = 25 * 1024 * 1024;
  const MAX_STORED_IMAGE_BYTES = 600 * 1024;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const seedImages = ["assets/feature-ecology.png", "assets/feature-machinery.png", "assets/feature-weather.png", "assets/news-cavern.png", "assets/about-team.png", "assets/research-lab.png", "assets/sustainability-world.png"];

  const defaults = {
    configVersion: 5,
    brand: "ASH/FALL",
    kicker: "FORGE 1.20.1 / 生存扩展模组",
    heroLine1: "Forever",
    heroLine2: "Advancing",
    heroLine3: "Architecture",
    heroSummary: "让环境、机械与天气共同书写每一次生存。",
    manifestoEyebrow: "持续设计、测试与重建",
    manifestoBody: "从深层矿脉到漂浮群岛，从机械工坊到雷暴云层，ASHFALL 正在构建一个更有回应的世界。每一种资源、每一套系统、每一次选择，都拥有真正的重量。",
    newsTitle: "ASHFALL 的\n最新动态",
    newsBody: "从版本发布、开发日志到社区合作，每一次更新都让这个世界更完整。",
    expertiseTitle: "探索完整的\n生存系统",
    expertiseBody: "从一株会随季节改变的植物，到横跨整个维度的能源网络。每个系统都独立成立，也彼此影响。",
    aboutTitle: "关于这个\n不断生长的世界",
    aboutBody: "我们是建筑者、设计者与代码作者。我们研究玩家如何探索、如何协作，也研究一个世界怎样才能值得长期居住。",
    researchTitle: "永远先于\n下一条曲线",
    researchBody: "分析、实验、压测、重构。我们的研究从世界生成延伸到多人同步，确保复杂系统也能保持清晰、稳定和可扩展。",
    sustainabilityTitle: "为长期世界\n而设计",
    sustainabilityBody: "从低负载世界生成到可迁移存档，我们把性能、兼容性与长期更新纳入每一项系统设计。",
    downloadTitle: "进入下一片\n未知荒野",
    downloadLabel: "下载 V2.4.0",
    downloadUrl: "#",
    version: "V2.4.0",
    releaseDate: "2026.08.21",
    loader: "Forge 1.20.1",
    accent: "#DDFD5A",
    heroShade: 34,
    heroFocus: 52,
    textureGrain: 5,
    mediaHighlight: 24,
    glassOpacity: 56,
    editorOpacity: 96,
    elementStyles: {},
    customElements: [],
    homeLinks: {},
    pages: [
      {
        id: "page-world-systems",
        slug: "world-systems",
        navLabel: "世界系统",
        eyebrow: "WORLD SYSTEMS / 01",
        title: "让每一片土地\n回应玩家",
        summary: "深入了解环境、气候与资源如何共同塑造 ASH/FALL 的生存体验。",
        contentTitle: "世界并非静止的背景",
        body: "气候会改变作物与能见度，地下热流决定机械网络的选址，而玩家的采集与建造也会持续改变周围生态。\n\n这些系统彼此独立，又通过清晰的规则互相影响，让每一次选择都留下可观察的结果。",
        heroImage: "assets/feature-weather.png",
        ctaLabel: "前往下载",
        ctaUrl: "./index.html#download",
        published: true,
      },
    ],
    heroImage: "assets/hero-ashfall.png",
    aboutImage: "assets/about-team.png",
    researchImage: "assets/research-lab.png",
    sustainabilityImage: "assets/sustainability-world.png",
    news: [
      ["版本", "2026.08.21", "V2.4.0：灰烬气候正式上线", "新增火山灰事件、地热增压与六种适应性植被。", "assets/news-cavern.png"],
      ["开发日志", "2026.08.14", "世界生成器开始重构", "新的地形规则让每次远征都拥有不同的资源脉络。", "assets/feature-ecology.png"],
      ["社区", "2026.08.02", "ASHFALL 建筑挑战赛开启", "用一周时间，把最危险的群系变成最值得居住的地方。", "assets/about-team.png"],
      ["机制", "2026.07.19", "天气系统进入多人测试", "气压、温度和海拔现在会在服务器间稳定同步。", "assets/feature-weather.png"],
      ["研究", "2026.07.06", "地热网络的第一张图纸", "能源不是凭空出现，新的生产线需要理解地下热流。", "assets/research-lab.png"],
      ["发布", "2026.06.22", "V2.3.0：深层矿脉", "六种矿物与一套新的矿井照明系统已加入游戏。", "assets/feature-machinery.png"],
      ["社区", "2026.06.10", "与建筑师一起做 Mod", "开放一场关于空间、路径与玩家记忆的线上工作坊。", "assets/about-team.png"],
      ["系统", "2026.05.26", "可迁移存档实验完成", "跨版本迁移不再抹掉你的世界历史与自定义规则。", "assets/sustainability-world.png"],
      ["合作", "2026.05.13", "ASHFALL x 星尘服务器", "首个大型公共服务器开始邀请玩家参与压力测试。", "assets/news-cavern.png"],
      ["机制", "2026.04.29", "植物会记住季节", "生态系统现在会根据湿度与玩家行为持续演化。", "assets/feature-ecology.png"],
      ["性能", "2026.04.12", "低负载区块缓存上线", "远处的世界更轻，近处的细节仍然完整。", "assets/research-lab.png"],
      ["视觉", "2026.03.24", "新的粒子调色板", "火山灰、冰晶与萤光矿物拥有了独立的光照反应。", "assets/feature-machinery.png"],
      ["版本", "2026.03.08", "V2.2.0：风暴预警", "新的气象台可以提前四分钟预测雷暴方向。", "assets/feature-weather.png"],
      ["研究", "2026.02.16", "多维度能源桥接", "让不同维度的能源系统拥有一致、可读的接口。", "assets/sustainability-world.png"],
      ["社区", "2026.01.28", "Mod 开发者日记上线", "每周公开一段真实的调试记录与设计决策。", "assets/about-team.png"],
      ["里程碑", "2026.01.09", "累计下载突破 86K", "感谢每一位把世界规则写进自己存档的玩家。", "assets/news-cavern.png"],
    ].map(([tag, date, title, body, image]) => ({ tag, date, title, body, image })),
    expertise: [
      ["生态系统", "会呼吸的植物与季节", "assets/feature-ecology.png"],
      ["机械系统", "能量、热量与效率", "assets/feature-machinery.png"],
      ["天气系统", "气压、温度与海拔", "assets/feature-weather.png"],
      ["世界生成", "每一片地形都有逻辑", "assets/news-cavern.png"],
      ["多人同步", "复杂规则稳定运行", "assets/research-lab.png"],
      ["探索档案", "记录每次远征", "assets/about-team.png"],
      ["兼容策略", "面向长期存档", "assets/sustainability-world.png"],
      ["社区工具", "和玩家一起迭代", "assets/about-team.png"],
    ].map(([title, caption, image]) => ({ title, caption, image })),
  };

  function mergeConfig(input = {}) {
    const merged = { ...clone(defaults), ...input };
    merged.elementStyles = { ...clone(defaults.elementStyles), ...(input.elementStyles || {}) };
    merged.customElements = Array.isArray(input.customElements) ? input.customElements : [];
    merged.pages = Array.isArray(input.pages) ? input.pages.map((page, index) => ({ ...clone(defaults.pages[0]), ...page, id: page.id || `page-${index + 1}` })) : clone(defaults.pages);
    merged.homeLinks = Object.fromEntries(Object.entries(input.homeLinks || {}).filter(([, pageId]) => merged.pages.some((page) => page.id === pageId)));
    merged.pages.forEach((page) => {
      if (typeof page.ctaUrl === "string") page.ctaUrl = page.ctaUrl.replace(/^\.\/#/, "./index.html#");
    });
    Object.values(merged.elementStyles).forEach((style) => {
      if (!style || style.positionMode) return;
      if (style.x != null || style.y != null || style.zIndex != null) style.positionMode = "free";
    });
    if (Number(input.configVersion || 0) < 3) {
      merged.heroLine1 = defaults.heroLine1;
      merged.heroLine2 = defaults.heroLine2;
      merged.heroLine3 = defaults.heroLine3;
    }
    merged.configVersion = defaults.configVersion;
    merged.news = defaults.news.map((item, index) => ({ ...item, ...(Array.isArray(input.news) ? input.news[index] : {}) }));
    merged.expertise = defaults.expertise.map((item, index) => ({ ...item, ...(Array.isArray(input.expertise) ? input.expertise[index] : {}) }));
    return merged;
  }

  let state;
  let hasStoredConfig = false;
  try {
    const storedConfig = isLocalDev ? localStorage.getItem(STORAGE_KEY) : null;
    hasStoredConfig = Boolean(storedConfig);
    state = mergeConfig(JSON.parse(storedConfig || "null") || {});
  } catch {
    state = clone(defaults);
  }

  async function loadBundledConfig() {
    if (hasStoredConfig || location.protocol === "file:") return false;
    try {
      const response = await fetch(DEFAULT_CONFIG_URL, { cache: "no-store" });
      if (!response.ok) return false;
      state = mergeConfig(await response.json());
      return true;
    } catch {
      return false;
    }
  }
  let past = [];
  let future = [];
  let interactionStart = null;
  let activeCollection = { news: 0, expertise: 0 };
  let saveTimer;
  let toastTimer;
  let selectedElementKey = null;
  let elementRegistry = new Map();
  let pickerMode = false;
  const initialPageSlug = new URLSearchParams(location.search).get("page");
  let viewPageId = initialPageSlug ? state.pages.find((page) => page.slug === initialPageSlug)?.id || "missing" : null;
  let activePageId = viewPageId && viewPageId !== "missing" ? viewPageId : state.pages[0]?.id || null;

  function showToast(message) {
    const toast = $(".toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function setText(element, value) {
    element.textContent = "";
    String(value ?? "").split("\n").forEach((line, index) => { if (index) element.append(document.createElement("br")); element.append(document.createTextNode(line)); });
  }

  function paintWords(element, value) {
    if (element.dataset.value === String(value)) return;
    element.dataset.value = String(value);
    element.textContent = "";
    const colors = ["#E7FF72", "#FF8B6A", "#8AF3EF", "#FFE485"];
    const tokens = String(value ?? "").match(/\r?\n|[\u4e00-\u9fff]|[A-Za-z0-9]+|[^\u4e00-\u9fffA-Za-z0-9\s]+|\s+/g) || [];
    let index = 0;
    tokens.forEach((token) => {
      if (/^\r?\n$/.test(token)) element.append(document.createElement("br"));
      else if (/^\s+$/.test(token)) element.append(document.createTextNode(token));
      else { const word = document.createElement("span"); word.className = "color-word"; word.dataset.wordIndex = index; word.style.setProperty("--word-color", colors[index % colors.length]); word.textContent = token; element.append(word); index += 1; }
    });
  }

  function updateWordWave() {
    $$('[data-color-text]').forEach((element) => {
      const words = $$(".color-word", element); if (!words.length) return;
      const rect = element.getBoundingClientRect(); const progress = Math.max(0, Math.min(1, (window.innerHeight * .88 - rect.top) / (window.innerHeight * .9 + rect.height))); const wave = Math.floor(progress * (words.length + 4));
      words.forEach((word, index) => { const distance = Math.abs(index - wave); word.style.setProperty("--wave-distance", Math.min(1, distance / 3).toFixed(2)); word.classList.toggle("is-lit", index >= wave - 2 && index <= wave + 2); word.classList.toggle("is-passed", index < wave - 2); });
    });
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function homeUrl(hash = "") { return `./index.html${String(hash || "").startsWith("#") ? hash : ""}`; }
  function pageUrl(slug) { return `./index.html?page=${encodeURIComponent(slug)}`; }
  function selectedPage() { return state.pages.find((page) => page.id === activePageId) || null; }
  function viewedPage() { return state.pages.find((page) => page.id === viewPageId) || null; }
  function cleanSlug(value) { return String(value || "page").trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff-]+/g, "-").replace(/^-+|-+$/g, "") || "page"; }
  function uniqueSlug(value, exceptId = null) { const base = cleanSlug(value); let slug = base; let suffix = 2; while (state.pages.some((page) => page.id !== exceptId && page.slug === slug)) slug = `${base}-${suffix++}`; return slug; }
  function previewPage(id) { const page = state.pages.find((item) => item.id === id); if (!page) return; viewPageId = page.id; activePageId = page.id; history.replaceState(null, "", pageUrl(page.slug)); selectedElementKey = null; render(); window.scrollTo({ top: 0, behavior: "auto" }); }

  function homeLinkTargetLabel(element) {
    const kind = element.matches("img") ? "图片" : "按钮";
    const newsIndex = element.closest(".news-card")?.dataset.newsIndex;
    if (newsIndex != null && element.classList.contains("card-cta")) return `${kind} · 更新卡片 ${String(Number(newsIndex) + 1).padStart(2, "0")} · 查看更新`;
    const expertiseIndex = element.closest(".expertise-item")?.dataset.expertiseIndex;
    if (expertiseIndex != null && element.classList.contains("item-arrow")) return `${kind} · 系统 ${String(Number(expertiseIndex) + 1).padStart(2, "0")} · ${element.closest(".expertise-item")?.querySelector("h3")?.textContent.trim() || "打开系统"}`;
    const name = String(element.matches("img") ? element.getAttribute("alt") || element.dataset.image || "未命名图片" : element.textContent || element.getAttribute("aria-label") || "未命名按钮").trim().replace(/\s+/g, " ").slice(0, 42);
    return `${kind} · ${elementScope(element)} · ${name}`;
  }

  function homeLinkTargets() {
    const targets = new Map();
    $$("main > section a, main > section button, main > section img, main > section .item-arrow").filter((element) => !element.matches(".rail-prev, .rail-next")).forEach((element) => {
      const key = elementKey(element);
      targets.set(key, { key, element, kind: element.matches("img") ? "image" : "button", label: homeLinkTargetLabel(element) });
    });
    state.customElements.filter((item) => !item.pageId && ["button", "image"].includes(item.type)).forEach((item) => {
      const key = `custom:${item.id}`;
      if (!targets.has(key)) targets.set(key, { key, element: null, kind: item.type, label: `${item.type === "image" ? "图片" : "按钮"} · ${item.section} · ${String(item.text || "未命名元素").slice(0, 42)}` });
    });
    return [...targets.values()];
  }

  function clearHomePageLinks() {
    $$('[data-home-page-link]').forEach((element) => {
      if (element.matches("a") && element.dataset.homeOriginalHref != null) element.setAttribute("href", element.dataset.homeOriginalHref);
      element.classList.remove("home-page-link-target");
      element.removeAttribute("data-home-page-link");
      element.removeAttribute("data-home-original-href");
      if (element.matches("img, .item-arrow")) { element.removeAttribute("role"); element.removeAttribute("tabindex"); }
    });
  }

  function applyHomePageLinks() {
    homeLinkTargets().forEach(({ key, element }) => {
      const page = state.pages.find((item) => item.id === state.homeLinks[key]);
      if (!element || !page) return;
      element.dataset.homePageLink = page.id;
      element.classList.add("home-page-link-target");
      if (element.matches("a")) {
        element.dataset.homeOriginalHref = element.getAttribute("href") || "#";
        element.setAttribute("href", pageUrl(page.slug));
      } else if (element.matches("img, .item-arrow")) {
        element.setAttribute("role", "link");
        element.tabIndex = 0;
      }
    });
  }

  function renderPageNavigation() {
    const pages = state.pages.filter((page) => page.published);
    const desktop = $("[data-page-nav]");
    const menu = $("[data-page-menu]");
    if (desktop) desktop.innerHTML = pages.map((page) => `<a href="${pageUrl(page.slug)}">${escapeHTML(page.navLabel || page.title)}</a>`).join("");
    if (menu) menu.innerHTML = pages.map((page, index) => `<a href="${pageUrl(page.slug)}"><span>${String(index + 5).padStart(2, "0")}</span>${escapeHTML(page.navLabel || page.title)}</a>`).join("");
  }

  function revealHeroMedia(image) {
    if (!image) return;
    const reveal = () => requestAnimationFrame(() => { if (image.isConnected) image.classList.add("is-loaded"); });
    image.addEventListener("load", reveal);
    if (image.complete && image.naturalWidth) reveal();
  }

  function renderSubpage() {
    const view = $("[data-subpage-view]");
    const homeSections = $$("main > section");
    const page = viewedPage();
    if (!viewPageId) {
      homeSections.forEach((section) => { section.hidden = false; });
      view.hidden = true;
      view.innerHTML = "";
      return null;
    }
    homeSections.forEach((section) => { section.hidden = true; });
    view.hidden = false;
    if (!page) {
      view.dataset.pageId = "missing";
      view.innerHTML = `<section class="subpage-missing section-dark" id="page-top"><p>404 / PAGE NOT FOUND</p><h1>这个页面尚不存在</h1><a class="inline-cta" href="${homeUrl()}" data-home-link>返回首页</a></section>`;
      document.title = `页面不存在 — ${state.brand}`;
      return null;
    }
    view.dataset.pageId = page.id;
    const title = String(page.title || "")
      .split("\n")
      .map((line, index) => `<span class="home-heading-item subpage-title-line" style="--title-line-index: ${index}">${escapeHTML(line) || "&nbsp;"}</span>`)
      .join("");
    const nextPages = state.pages.filter((item) => item.published && item.id !== page.id);
    const next = nextPages[0];
    view.innerHTML = `
      <section class="subpage-hero" id="page-top">
        <img class="subpage-hero-media" src="${escapeHTML(page.heroImage)}" alt="" data-page-image-display="heroImage" />
        <div class="subpage-hero-overlay" aria-hidden="true"></div>
        <a class="subpage-back" href="${homeUrl()}" data-home-link><span aria-hidden="true">←</span> 首页</a>
        <p class="subpage-eyebrow" data-page-field-display="eyebrow">${escapeHTML(page.eyebrow)}</p>
        <h1 class="subpage-heading" data-page-field-display="title">${title}</h1>
        <p class="subpage-summary" data-page-field-display="summary">${escapeHTML(page.summary)}</p>
      </section>
      <section class="subpage-content section-light" id="page-content">
        <div class="section-tag"><span>01</span><p>${escapeHTML(page.navLabel)}</p></div>
        <div class="subpage-copy">
          <h2 data-page-field-display="contentTitle">${escapeHTML(page.contentTitle)}</h2>
          <p data-page-field-display="body">${escapeHTML(page.body)}</p>
          <a class="inline-cta dark" href="${escapeHTML(page.ctaUrl || "#")}" data-page-cta data-page-field-display="ctaLabel">${escapeHTML(page.ctaLabel)} <span class="double-arrow" data-element-key="page:${escapeHTML(page.id)}:content:cta-arrow" aria-hidden="true"><i data-lucide="arrow-right"></i><i data-lucide="arrow-right"></i></span></a>
        </div>
      </section>
      <section class="subpage-next section-dark${next ? "" : " is-home-return"}" id="page-next">
        <p>继续探索</p>
        ${next ? `<a href="${pageUrl(next.slug)}"><span class="subpage-next-meta">${escapeHTML(next.eyebrow)}</span><strong>${escapeHTML(next.title).replace(/\n/g, " ")}</strong><span class="double-arrow subpage-next-arrow" data-element-key="page:${escapeHTML(page.id)}:next:arrow" aria-hidden="true"><i data-lucide="arrow-right"></i><i data-lucide="arrow-right"></i></span></a>` : `<a href="${homeUrl("#download")}" data-home-link="#download"><span class="subpage-next-meta">ASH/FALL</span><strong>返回首页继续探索</strong><span class="double-arrow subpage-next-arrow" data-element-key="page:${escapeHTML(page.id)}:next:arrow" aria-hidden="true"><i data-lucide="arrow-right"></i><i data-lucide="arrow-right"></i></span></a>`}
      </section>`;
    revealHeroMedia($(".subpage-hero-media", view));
    document.title = `${page.title.replace(/\n/g, " ")} — ${state.brand}`;
    return page;
  }

  function renderNews() {
    const rail = $(".news-rail");
    rail.innerHTML = state.news.map((item, index) => `<article class="news-card reveal-card" data-news-index="${index}"><div class="news-card-image"><img src="${item.image}" alt="${item.title}" loading="lazy" /><div class="news-card-content"><div class="news-meta"><p>${item.tag}</p><p><span>${String(index + 1).padStart(2, "0")}</span>/16 · ${item.date}</p></div><h3>${item.title}</h3><p>${item.body}</p><a href="#download" class="card-cta">查看更新 <span class="double-arrow"><i data-lucide="arrow-right"></i><i data-lucide="arrow-right"></i></span></a></div></div></article>`).join("");
    rail.querySelectorAll(".news-card").forEach((card, index) => { card.addEventListener("mouseenter", () => setActiveNews(index)); card.addEventListener("focusin", () => setActiveNews(index)); });
    if (window.lucide) window.lucide.createIcons();
    observeReveals();
  }

  function renderExpertise() {
    const list = $(".expertise-list");
    list.innerHTML = state.expertise.map((item, index) => `<article class="expertise-item reveal-card" data-expertise-index="${index}"><div class="expertise-number">${String(index + 1).padStart(2, "0")}</div><div><h3>${item.title}</h3><p>${item.caption}</p></div><div class="expertise-thumb"><img src="${item.image}" alt="${item.title}" loading="lazy" /></div><span class="item-arrow"><i data-lucide="arrow-up-right"></i></span></article>`).join("");
    if (window.lucide) window.lucide.createIcons();
    observeReveals();
  }

  const elementSelectors = [
    ".site-header, .site-header a, .site-header nav a, .site-header button",
    "main > section, main > section > *, main h1, main h2, main h3, main p, main a, main img, main button",
    ".news-card, .news-card-image, .news-card-content, .news-card h3, .news-card-content > p, .news-card .card-cta",
    ".expertise-item, .expertise-item h3, .expertise-item p, .expertise-thumb, .expertise-item .item-arrow",
    ".site-footer, .site-footer a, .site-footer h3, .site-footer p, .custom-element",
    ".subpage-view section, .subpage-view section > *, .subpage-view h1, .subpage-view h2, .subpage-view p, .subpage-view a, .subpage-view img, .subpage-view .double-arrow",
  ].join(", ");

  function elementScope(element) {
    const section = element.closest("section, header, footer");
    return section?.id || section?.className?.split(" ")[0] || "page";
  }

  function sectionOptions() {
    return [...document.querySelectorAll("main > section:not([hidden]), .subpage-view:not([hidden]) > section")].map((section) => ({
      value: section.id || section.className.split(" ")[0],
      label: section.id || section.className.split(" ")[0],
    }));
  }

  function renderCustomElements() {
    $$("[data-custom-element]").forEach((element) => element.remove());
    state.customElements.forEach((item) => {
      if ((item.pageId || null) !== (viewPageId && viewPageId !== "missing" ? viewPageId : null)) return;
      const section = document.getElementById(item.section) || $("main > section");
      if (!section) return;
      const layer = section.querySelector(":scope > .custom-elements-layer") || (() => { const node = document.createElement("div"); node.className = "custom-elements-layer"; section.append(node); return node; })();
      const element = item.type === "image" ? document.createElement("img") : document.createElement(item.type === "heading" ? "h2" : item.type === "button" ? "a" : "p");
      element.dataset.customElement = item.id;
      element.dataset.elementKey = `custom:${item.id}`;
      element.className = `custom-element custom-element-${item.type}`;
      if (item.type === "image") { element.src = item.src || seedImages[0]; element.alt = item.text || "自定义图片"; }
      else { element.textContent = item.text || (item.type === "button" ? "新按钮" : item.type === "heading" ? "新标题" : "新文本"); if (item.type === "button") { element.href = item.href || "#"; element.className += " inline-cta"; } }
      layer.append(element);
    });
  }

  function elementKey(element) {
    if (element.dataset.elementKey) return element.dataset.elementKey;
    const pageId = element.closest("[data-subpage-view]")?.dataset.pageId;
    if (pageId && pageId !== "missing") {
      if (element.dataset.pageFieldDisplay) return `page:${pageId}:field:${element.dataset.pageFieldDisplay}`;
      if (element.dataset.pageImageDisplay) return `page:${pageId}:image:${element.dataset.pageImageDisplay}`;
      const pageSection = element.closest("section")?.id || "page";
      const samePageElements = $$(elementSelectors).filter((candidate) => candidate.closest("[data-subpage-view]")?.dataset.pageId === pageId && candidate.closest("section")?.id === pageSection && candidate.tagName === element.tagName);
      return `page:${pageId}:${pageSection}:${element.tagName.toLowerCase()}:${Math.max(0, samePageElements.indexOf(element))}`;
    }
    if (element.id) return `id:${element.id}`;
    const news = element.closest(".news-card")?.dataset.newsIndex;
    if (news != null) {
      if (element.classList.contains("news-card")) return `news:${news}`;
      if (element.classList.contains("news-card-image")) return `news:${news}:image`;
      if (element.classList.contains("news-card-content")) return `news:${news}:content`;
      if (element.matches("h3")) return `news:${news}:title`;
      if (element.classList.contains("card-cta")) return `news:${news}:cta`;
      if (element.closest(".news-meta")) {
        const metaItems = [...element.closest(".news-meta").querySelectorAll(":scope > p")];
        return `news:${news}:meta:${Math.max(0, metaItems.indexOf(element))}`;
      }
      if (element.matches("p")) return `news:${news}:body`;
    }
    const expertise = element.closest(".expertise-item")?.dataset.expertiseIndex;
    if (expertise != null) {
      if (element.classList.contains("expertise-item")) return `expertise:${expertise}`;
      if (element.matches("h3")) return `expertise:${expertise}:title`;
      if (element.matches("p")) return `expertise:${expertise}:caption`;
      if (element.classList.contains("expertise-thumb")) return `expertise:${expertise}:image`;
      if (element.classList.contains("item-arrow")) return `expertise:${expertise}:arrow`;
    }
    const same = $$(elementSelectors).filter((candidate) => candidate.tagName === element.tagName && elementScope(candidate) === elementScope(element));
    return `${elementScope(element)}:${element.tagName.toLowerCase()}:${Math.max(0, same.indexOf(element))}`;
  }

  function elementLabel(element) {
    const bind = element.dataset.bind;
    if (bind) return `${bind} · ${String(element.textContent).trim().replace(/\s+/g, " ").slice(0, 38)}`;
    if (element.dataset.pageFieldDisplay) return `${element.dataset.pageFieldDisplay} · ${String(element.textContent).trim().replace(/\s+/g, " ").slice(0, 38)}`;
    if (element.dataset.newsIndex != null) return `新闻 ${String(Number(element.dataset.newsIndex) + 1).padStart(2, "0")}`;
    if (element.dataset.expertiseIndex != null) return `系统 ${String(Number(element.dataset.expertiseIndex) + 1).padStart(2, "0")}`;
    const text = String(element.textContent || element.getAttribute("alt") || element.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ");
    return `${element.tagName.toLowerCase()} · ${text.slice(0, 42) || elementScope(element)}`;
  }

  function refreshElementRegistry() {
    elementRegistry = new Map();
    $$(elementSelectors).forEach((element) => {
      if (element.closest(".editor, .search-layer, .menu-layer, .page-loader") || element.closest("[hidden]")) return;
      const key = elementKey(element);
      element.dataset.elementId = key;
      elementRegistry.set(key, element);
    });
    applyElementStyles();
    renderElementList();
    syncElementInspector();
  }

  function colorToHex(value, fallback = "#111311") {
    const match = String(value || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) return `#${[match[1], match[2], match[3]].map((part) => Number(part).toString(16).padStart(2, "0")).join("")}`;
    return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
  }

  function applyOneElementStyle(element, style = {}) {
    const props = { opacity: "opacity", color: "color", backgroundColor: "backgroundColor", fontSize: "fontSize", borderRadius: "borderRadius", paddingTop: "paddingTop", paddingBottom: "paddingBottom", marginTop: "marginTop", marginBottom: "marginBottom", height: "height" };
    Object.entries(props).forEach(([key, property]) => { if (style[key] != null && style[key] !== "") element.style[property] = key === "opacity" ? Number(style[key]) / 100 : key === "fontSize" || key.includes("padding") || key.includes("margin") || key === "borderRadius" || key === "height" ? `${style[key]}px` : style[key]; else element.style.removeProperty(property); });
    element.style.boxSizing = style.width || style.height ? "border-box" : "";
    element.style.overflowY = style.height ? "auto" : "";
    const mode = style.positionMode || "flow";
    const align = style.align || "left";
    if (mode === "free") {
      element.style.position = "absolute";
      element.style.left = `${Number(style.x ?? 50)}%`;
      element.style.top = `${Number(style.y ?? 50)}%`;
      element.style.width = style.width ? `${Number(style.width)}%` : "auto";
      element.style.maxWidth = "none";
      element.style.minWidth = "0";
      element.style.zIndex = String(style.zIndex ?? 5);
      element.style.translate = `${align === "center" ? "-50%" : align === "right" ? "-100%" : "0"} ${Number(style.translateY || 0)}px`;
      element.style.textAlign = align === "stretch" ? "left" : align;
    } else {
      ["position", "left", "top", "zIndex", "textAlign"].forEach((property) => element.style.removeProperty(property));
      if (style.width) element.style.width = `${Number(style.width)}%`; else element.style.removeProperty("width");
      element.style.maxWidth = style.width ? "none" : "";
      element.style.minWidth = style.width ? "0" : "";
      if (style.translateY != null && style.translateY !== "") element.style.translate = `0 ${style.translateY}px`; else element.style.removeProperty("translate");
      element.style.marginInline = align === "center" ? "auto" : "";
      element.style.marginInlineStart = align === "right" ? "auto" : "";
      if (align === "stretch") element.style.width = "100%";
    }
    element.style.display = style.hidden || style.deleted ? "none" : "";
    element.style.animationPlayState = style.motionOff ? "paused" : "";
    element.style.transition = style.motionOff ? "none" : "";
    if (style.text && !element.matches("img") && element.children.length === 0 && !element.dataset.bind && !element.dataset.pageFieldDisplay) element.textContent = style.text;
    if (style.src && element.matches("img")) element.src = style.src;
    if (style.href && element.matches("a")) element.href = style.href;
    if (element.dataset.homeLink != null) element.setAttribute("href", homeUrl(element.dataset.homeLink));
    element.classList.toggle("element-selected", selectedElementKey === element.dataset.elementId);
  }

  function applyElementStyles() { elementRegistry.forEach((element, key) => applyOneElementStyle(element, state.elementStyles[key] || {})); }

  function renderElementList() {
    const list = $(".element-list"); if (!list) return;
    const query = $("[data-element-search]")?.value.trim().toLowerCase() || "";
    const scope = $("[data-element-scope]")?.value || "";
    list.innerHTML = "";
    [...elementRegistry.entries()].filter(([, element]) => (!scope || elementScope(element) === scope) && (!query || elementLabel(element).toLowerCase().includes(query) || element.dataset.elementId.toLowerCase().includes(query))).forEach(([key, element], index) => {
      const button = document.createElement("button"); button.type = "button"; button.className = `element-list-item${key === selectedElementKey ? " is-selected" : ""}${state.elementStyles[key]?.deleted ? " is-deleted" : ""}`; button.dataset.elementSelect = key; button.setAttribute("role", "option"); button.setAttribute("aria-selected", String(key === selectedElementKey));
      const number = document.createElement("b"); number.className = "element-list-number"; number.textContent = String(index + 1).padStart(2, "0"); const tag = document.createElement("small"); tag.textContent = elementScope(element); const label = document.createElement("span"); label.textContent = elementLabel(element); button.append(number, tag, label); list.append(button);
    });
  }

  function syncElementInspector() {
    const panel = $(".element-inspector"); if (!panel) return;
    const element = selectedElementKey ? elementRegistry.get(selectedElementKey) : null; panel.hidden = !element;
    if (!element) return;
    const style = state.elementStyles[selectedElementKey] || {};
    $("[data-element-name]").textContent = elementLabel(element); const text = $("[data-element-text]"); const textBinding = element.dataset.bind || element.dataset.colorText; const pageField = element.dataset.pageFieldDisplay; const page = pageField ? viewedPage() : null; text.value = pageField ? page?.[pageField] ?? "" : textBinding ? state[textBinding] ?? "" : style.text ?? (element.children.length ? "" : element.textContent.trim()); text.disabled = element.children.length > 0 && !textBinding && !pageField;
    const href = $("[data-element-href]"); href.value = element.dataset.homeLink != null ? homeUrl(element.dataset.homeLink) : style.href ?? (element.matches("a") ? element.getAttribute("href") || "" : ""); href.disabled = !element.matches("a") || element.dataset.homeLink != null;
    const source = $("[data-element-src]"); source.value = style.src ?? (element.matches("img") ? element.getAttribute("src") || "" : ""); source.disabled = !element.matches("img"); source.closest(".element-source-field").hidden = !element.matches("img");
    $("[data-element-color]").value = colorToHex(style.color || getComputedStyle(element).color); $("[data-element-bg]").value = colorToHex(style.backgroundColor || getComputedStyle(element).backgroundColor, "#ffffff");
    ["opacity", "fontSize", "borderRadius", "translateY"].forEach((key) => { const input = $(`[data-element-style="${key}"]`); const output = $(`[data-element-output="${key}"]`); const value = style[key]; input.value = value ?? (key === "opacity" ? 100 : key === "translateY" ? 0 : 0); output.textContent = value == null && key !== "opacity" && key !== "translateY" ? "继承" : `${value ?? (key === "opacity" ? 100 : 0)}${key === "opacity" ? "%" : "px"}`; });
    ["paddingTop", "paddingBottom", "marginTop", "marginBottom"].forEach((key) => { const input = $(`[data-element-style="${key}"]`); input.value = style[key] ?? ""; });
    $$(`[data-position-mode]`).forEach((button) => button.classList.toggle("is-active", (style.positionMode || "flow") === button.dataset.positionMode));
    $$(`[data-element-align]`).forEach((button) => button.classList.toggle("is-active", (style.align || "left") === button.dataset.elementAlign));
    ["x", "y", "width", "height", "zIndex"].forEach((key) => { const input = $(`[data-element-style="${key}"]`); const output = $(`[data-element-output="${key}"]`); const fallback = key === "x" || key === "y" ? 50 : key === "width" ? 40 : key === "height" ? 0 : 5; if (input) { if (key === "x" || key === "y") { input.min = "-100"; input.max = "200"; } if (key === "width") { input.min = "5"; input.max = "200"; } if (key === "height") { input.min = "0"; input.max = "2400"; } input.value = style[key] ?? fallback; } if (output) output.textContent = key === "height" && !style[key] ? "自动" : `${input?.value ?? ""}${key === "zIndex" ? "" : key === "height" ? "px" : "%"}`; });
    $("[data-element-style=hidden]").checked = Boolean(style.hidden); $("[data-element-style=motionOff]").checked = Boolean(style.motionOff);
  }

  function updateElementStyle(key, property, value) { if (!key || !elementRegistry.has(key)) return; const previous = clone(state); state.elementStyles[key] = { ...(state.elementStyles[key] || {}) }; if (value === "" || value == null || value === false && ["hidden", "motionOff"].includes(property)) delete state.elementStyles[key][property]; else state.elementStyles[key][property] = value; remember(previous); applyElementStyles(); syncElementInspector(); saveState(); }

  function setActiveNews(index) {
    $$(".news-card").forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
    $("[data-news-current]").textContent = String(index + 1).padStart(2, "0");
  }

  function render({ sync = true } = {}) {
    clearHomePageLinks();
    $$('[data-bind]').forEach((element) => setText(element, state[element.dataset.bind]));
    $$('[data-color-text]').forEach((element) => paintWords(element, state[element.dataset.colorText]));
    $$('[data-bind-href]').forEach((element) => { element.href = state[element.dataset.bindHref] || "#"; });
    $$('[data-image]').forEach((image) => {
      const source = state[image.dataset.image];
      if (image.getAttribute("src") === source) return;
      if (image.classList.contains("hero-media")) image.classList.remove("is-loaded");
      image.src = source;
    });
    document.documentElement.style.setProperty("--accent", state.accent);
    document.documentElement.style.setProperty("--hero-shade", Number(state.heroShade) / 100);
    document.documentElement.style.setProperty("--hero-focus", `${state.heroFocus}%`);
    document.documentElement.style.setProperty("--grain-opacity", Number(state.textureGrain) / 100);
    document.documentElement.style.setProperty("--highlight-opacity", Number(state.mediaHighlight) / 100);
    document.documentElement.style.setProperty("--glass-alpha", Number(state.glassOpacity) / 100);
    $(".editor").style.opacity = Math.max(.35, Math.min(1, Number(state.editorOpacity ?? 96) / 100));
    document.title = `${state.brand} — Minecraft Mod`;
    renderPageNavigation(); renderSubpage(); renderNews(); renderExpertise(); renderCustomElements(); syncElementScopes();
    refreshElementRegistry();
    applyHomePageLinks();
    if (sync) syncControls();
    updateWordWave(); updateHistoryButtons();
  }

  function syncControls() {
    $$('[data-setting]').forEach((input) => { if (document.activeElement !== input) input.value = state[input.dataset.setting] ?? ""; });
    $("[data-color-output]").textContent = state.accent.toUpperCase();
    $$('[data-range-output]').forEach((output) => { output.textContent = `${state[output.dataset.rangeOutput]}%`; });
    $$('[data-collection-select]').forEach((select) => {
      const type = select.dataset.collectionSelect; const collection = state[type]; select.innerHTML = collection.map((item, index) => `<option value="${index}">${String(index + 1).padStart(2, "0")} · ${item.title}</option>`).join(""); select.value = activeCollection[type];
    });
    syncCollectionControls("news"); syncCollectionControls("expertise");
    syncPageControls();
  }

  function renderPageList() {
    const list = $("[data-page-list]"); if (!list) return;
    list.innerHTML = state.pages.map((page, index) => `<button type="button" class="page-list-item${page.id === activePageId ? " is-selected" : ""}" data-page-select="${escapeHTML(page.id)}" role="option" aria-selected="${page.id === activePageId}"><b>${String(index + 1).padStart(2, "0")}</b><span><strong>${escapeHTML(page.navLabel || page.title)}</strong><small>/${escapeHTML(page.slug)}${page.published ? " · 已发布" : " · 草稿"}</small></span></button>`).join("");
  }

  function renderHomeLinkControls(page) {
    const select = $("[data-page-home-target]");
    const list = $("[data-page-home-links]");
    const count = $("[data-page-home-link-count]");
    const connect = $(".page-home-connect");
    if (!select || !list || !count || !connect) return;
    const previousValue = select.value;
    const targets = homeLinkTargets();
    const targetMap = new Map(targets.map((target) => [target.key, target]));
    const linked = page ? Object.entries(state.homeLinks).filter(([, pageId]) => pageId === page.id) : [];
    select.textContent = "";
    select.append(new Option(targets.length ? "选择首页入口" : "没有可连接的首页元素", ""));
    [["button", "按钮"], ["image", "图片"]].forEach(([kind, label]) => {
      const matches = targets.filter((target) => target.kind === kind);
      if (!matches.length) return;
      const group = document.createElement("optgroup");
      group.label = label;
      matches.forEach((target, index) => {
        const linkedPage = state.pages.find((item) => item.id === state.homeLinks[target.key]);
        const suffix = linkedPage ? linkedPage.id === page?.id ? " · 已连接" : ` → ${linkedPage.navLabel || linkedPage.title}` : "";
        group.append(new Option(`${String(index + 1).padStart(2, "0")} · ${target.label}${suffix}`, target.key));
      });
      select.append(group);
    });
    if ([...select.options].some((option) => option.value === previousValue)) select.value = previousValue;
    connect.disabled = !page || !targets.length;
    count.textContent = `${linked.length} 个`;
    list.textContent = "";
    linked.forEach(([key]) => {
      const row = document.createElement("div");
      row.className = "page-home-link-item";
      const label = document.createElement("span");
      label.textContent = targetMap.get(key)?.label || `已移除元素 · ${key}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.pageHomeUnlink = key;
      remove.className = "icon-button";
      remove.setAttribute("aria-label", `解除 ${label.textContent}`);
      remove.dataset.tooltip = "解除连接";
      remove.innerHTML = '<i data-lucide="unlink"></i>';
      row.append(label, remove);
      list.append(row);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function syncPageControls() {
    if (activePageId && !state.pages.some((page) => page.id === activePageId)) activePageId = state.pages[0]?.id || null;
    const page = selectedPage();
    renderPageList();
    const inspector = $("[data-page-inspector]"); if (!inspector) return;
    inspector.hidden = !page;
    if (!page) { renderHomeLinkControls(null); return; }
    $$('[data-page-field]', inspector).forEach((input) => { if (document.activeElement === input) return; if (input.type === "checkbox") input.checked = Boolean(page[input.dataset.pageField]); else input.value = page[input.dataset.pageField] ?? ""; });
    const open = $(".page-open"); if (open) open.href = pageUrl(page.slug);
    renderHomeLinkControls(page);
  }

  function syncCollectionControls(type) {
    const item = state[type][activeCollection[type]]; if (!item) return;
    $$(`[data-collection="${type}"]`).forEach((input) => { if (document.activeElement !== input) input.value = item[input.dataset.field] ?? ""; });
  }

  function saveState() {
    if (!window.localStorage) return false;
    const indicator = $(".save-indicator"); indicator.innerHTML = "<i></i> 正在保存...";
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { indicator.classList.add("is-error"); indicator.innerHTML = "<i></i> 存储空间不足，未保存"; showToast("存储空间不足，请导出配置并减少图片"); return false; }
    indicator.classList.remove("is-error");
    clearTimeout(saveTimer); saveTimer = setTimeout(() => { indicator.innerHTML = "<i></i> 所有更改已保存"; }, 180);
    return true;
  }
  window.addEventListener("pagehide", () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} });

  function remember(snapshot) { if (!snapshot || JSON.stringify(snapshot) === JSON.stringify(state)) return; past.push(snapshot); if (past.length > MAX_HISTORY) past.shift(); future = []; updateHistoryButtons(); }
  function updateHistoryButtons() { $(".undo-button").disabled = !past.length; $(".redo-button").disabled = !future.length; $(".undo-button").style.opacity = past.length ? "1" : ".3"; $(".redo-button").style.opacity = future.length ? "1" : ".3"; }
  function applySetting(input) { state[input.dataset.setting] = input.value; render({ sync: false }); syncControls(); saveState(); }

  $$('[data-setting]').forEach((input) => { input.addEventListener("focus", () => { interactionStart = clone(state); }); input.addEventListener("input", () => applySetting(input)); input.addEventListener("change", () => { remember(interactionStart); interactionStart = null; }); });
  $$('[data-collection-select]').forEach((select) => select.addEventListener("change", () => { activeCollection[select.dataset.collectionSelect] = Number(select.value); syncControls(); }));
  $$('[data-collection]').forEach((input) => { input.addEventListener("focus", () => { interactionStart = clone(state); }); input.addEventListener("input", () => { state[input.dataset.collection][activeCollection[input.dataset.collection]][input.dataset.field] = input.value; render({ sync: false }); saveState(); }); input.addEventListener("change", () => { remember(interactionStart); interactionStart = null; }); });

  $("[data-page-list]")?.addEventListener("click", (event) => { const button = event.target.closest("[data-page-select]"); if (!button) return; previewPage(button.dataset.pageSelect); });
  $$('[data-page-field]').forEach((input) => {
    input.addEventListener("focus", () => { interactionStart = clone(state); });
    input.addEventListener("input", () => { const page = selectedPage(); if (!page) return; page[input.dataset.pageField] = input.type === "checkbox" ? input.checked : input.value; render({ sync: false }); renderPageList(); saveState(); });
    input.addEventListener("change", () => { const page = selectedPage(); if (page && input.dataset.pageField === "slug") { page.slug = uniqueSlug(input.value, page.id); input.value = page.slug; if (viewPageId === page.id) history.replaceState(null, "", pageUrl(page.slug)); render({ sync: false }); renderPageList(); saveState(); } remember(interactionStart); interactionStart = null; });
  });
  $(".page-add")?.addEventListener("click", () => { const previous = clone(state); const id = `page-${Date.now().toString(36)}`; const page = { ...clone(defaults.pages[0]), id, slug: uniqueSlug("new-page"), navLabel: "新页面", eyebrow: "NEW PAGE", title: "新的故事页面", summary: "在这里填写页面摘要。", contentTitle: "正文标题", body: "在这里填写完整正文。", published: true }; state.pages.push(page); remember(previous); previewPage(id); saveState(); showToast("已新增并发布子页面"); });
  $(".page-duplicate")?.addEventListener("click", () => { const source = selectedPage(); if (!source) return; const previous = clone(state); const copy = { ...clone(source), id: `page-${Date.now().toString(36)}`, slug: uniqueSlug(`${source.slug}-copy`), navLabel: `${source.navLabel}副本`, published: false }; state.pages.push(copy); remember(previous); previewPage(copy.id); saveState(); showToast("已复制为草稿"); });
  $(".page-delete")?.addEventListener("click", () => { const page = selectedPage(); if (!page) return; const previous = clone(state); const customIds = state.customElements.filter((item) => item.pageId === page.id).map((item) => item.id); state.pages = state.pages.filter((item) => item.id !== page.id); state.customElements = state.customElements.filter((item) => item.pageId !== page.id); state.homeLinks = Object.fromEntries(Object.entries(state.homeLinks).filter(([, pageId]) => pageId !== page.id)); Object.keys(state.elementStyles).filter((key) => key.startsWith(`page:${page.id}:`) || customIds.some((id) => key === `custom:${id}`)).forEach((key) => delete state.elementStyles[key]); if (viewPageId === page.id) { viewPageId = null; history.replaceState(null, "", location.pathname); } activePageId = state.pages[0]?.id || null; remember(previous); render(); saveState(); showToast("页面已删除，可撤销"); });
  $(".page-copy-link")?.addEventListener("click", async () => { const page = selectedPage(); if (!page) return; const url = new URL(pageUrl(page.slug), location.href).href; try { await navigator.clipboard.writeText(url); showToast("页面链接已复制"); } catch { showToast(url); } });
  $(".page-home-connect")?.addEventListener("click", () => {
    const page = selectedPage();
    const targetKey = $("[data-page-home-target]")?.value;
    if (!page || !targetKey) { showToast("先选择一个首页按钮或图片"); return; }
    const previous = clone(state);
    state.homeLinks[targetKey] = page.id;
    remember(previous);
    render();
    saveState();
    showToast("首页入口已连接到当前子页");
  });
  $("[data-page-home-links]")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page-home-unlink]");
    if (!button) return;
    const previous = clone(state);
    delete state.homeLinks[button.dataset.pageHomeUnlink];
    remember(previous);
    render();
    saveState();
    showToast("首页入口连接已解除");
  });

  $(".element-list")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-element-select]"); if (!button) return;
    selectedElementKey = button.dataset.elementSelect; renderElementList(); applyElementStyles(); syncElementInspector();
    elementRegistry.get(selectedElementKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  $("[data-element-search]")?.addEventListener("input", renderElementList);
  $("[data-element-scope]")?.addEventListener("change", renderElementList);
  function syncElementScopes() {
    const options = sectionOptions();
    const sectionSelect = $("[data-new-element-section]");
    if (sectionSelect) { const value = sectionSelect.value; sectionSelect.innerHTML = options.map((item) => `<option value="${item.value}">${item.label}</option>`).join(""); if (options.some((item) => item.value === value)) sectionSelect.value = value; }
    const scopeSelect = $("[data-element-scope]");
    if (scopeSelect) { const value = scopeSelect.value; scopeSelect.innerHTML = `<option value="">全部分区</option>${options.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}`; if (!value || options.some((item) => item.value === value)) scopeSelect.value = value; }
  }
  $(".element-clear")?.addEventListener("click", () => { selectedElementKey = null; renderElementList(); syncElementInspector(); });
  function setPickerMode(active) { pickerMode = active; document.body.classList.toggle("element-picker-active", active); const button = $("[data-element-pick]"); button?.classList.toggle("is-active", active); button?.setAttribute("aria-pressed", String(active)); }
  $("[data-element-pick]")?.addEventListener("click", () => setPickerMode(!pickerMode));
  $(".element-reset")?.addEventListener("click", () => { if (!selectedElementKey) return; const previous = clone(state); delete state.elementStyles[selectedElementKey]; remember(previous); render(); saveState(); showToast("此元素已恢复默认"); });
  $(".element-delete")?.addEventListener("click", () => { if (!selectedElementKey) return; updateElementStyle(selectedElementKey, "deleted", true); showToast("元素已隐藏，可恢复"); });
  $(".element-add")?.addEventListener("click", () => { const type = $("[data-new-element-type]").value; const section = $("[data-new-element-section]").value; const id = `custom-${Date.now().toString(36)}`; const item = { id, type, section, pageId: viewPageId && viewPageId !== "missing" ? viewPageId : null, text: type === "button" ? "新按钮" : type === "heading" ? "新标题" : type === "image" ? "自定义图片" : "新文本", href: "#", src: seedImages[0] }; const previous = clone(state); state.customElements.push(item); state.elementStyles[`custom:${id}`] = { positionMode: "free", align: "center", x: 50, y: 50, width: type === "image" ? 32 : 40, zIndex: 5 }; remember(previous); render(); selectedElementKey = `custom:${id}`; renderElementList(); syncElementInspector(); saveState(); showToast("已新增元素"); });
  $$("[data-position-mode]").forEach((button) => button.addEventListener("click", () => updateElementStyle(selectedElementKey, "positionMode", button.dataset.positionMode)));
  $$("[data-element-align]").forEach((button) => button.addEventListener("click", () => updateElementStyle(selectedElementKey, "align", button.dataset.elementAlign)));
  $$('[data-element-style="x"], [data-element-style="y"]').forEach((input) => { input.min = "-100"; input.max = "200"; });
  $$('[data-element-style="width"]').forEach((input) => { input.min = "5"; input.max = "200"; });
  $$('[data-element-style="height"]').forEach((input) => { input.min = "0"; input.max = "1600"; });
  $("[data-element-text]")?.addEventListener("input", (event) => { const element = elementRegistry.get(selectedElementKey); if (!element) return; const textBinding = element.dataset.bind || element.dataset.colorText; const pageField = element.dataset.pageFieldDisplay; if (pageField && viewedPage()) { viewedPage()[pageField] = event.target.value; render({ sync: false }); syncPageControls(); saveState(); } else if (textBinding) { state[textBinding] = event.target.value; render({ sync: false }); saveState(); } else updateElementStyle(selectedElementKey, "text", event.target.value); });
  $("[data-element-href]")?.addEventListener("input", (event) => { const element = elementRegistry.get(selectedElementKey); if (element?.dataset.pageCta != null && viewedPage()) { viewedPage().ctaUrl = event.target.value; render({ sync: false }); saveState(); } else updateElementStyle(selectedElementKey, "href", event.target.value); });
  $("[data-element-src]")?.addEventListener("input", (event) => { const element = elementRegistry.get(selectedElementKey); const field = element?.dataset.pageImageDisplay; if (field && viewedPage()) { viewedPage()[field] = event.target.value; render({ sync: false }); saveState(); } else updateElementStyle(selectedElementKey, "src", event.target.value); });
  $("[data-element-color]")?.addEventListener("input", (event) => updateElementStyle(selectedElementKey, "color", event.target.value));
  $("[data-element-bg]")?.addEventListener("input", (event) => updateElementStyle(selectedElementKey, "backgroundColor", event.target.value));
  $$('[data-element-style]').forEach((input) => input.addEventListener("input", () => updateElementStyle(selectedElementKey, input.dataset.elementStyle, input.type === "checkbox" ? input.checked : input.value)));

  function toggleEditor(open) { document.body.classList.toggle("editor-open", open); if (!open) setPickerMode(false); $(".editor").setAttribute("aria-hidden", String(!open)); $(".edit-button").setAttribute("aria-expanded", String(open)); if (open) setTimeout(() => $(".editor-close").focus(), 280); else $(".edit-button").focus(); }
  $(".edit-button").addEventListener("click", () => toggleEditor(true)); $(".editor-close").addEventListener("click", () => toggleEditor(false)); $(".done-button").addEventListener("click", () => toggleEditor(false)); $(".editor-backdrop").addEventListener("click", () => toggleEditor(false));
  $$(".editor-tabs button").forEach((button) => button.addEventListener("click", () => { $$(".editor-tabs button").forEach((tab) => { const active = tab === button; tab.classList.toggle("is-active", active); tab.setAttribute("aria-selected", active); }); $$(".editor-panel").forEach((panel) => { panel.hidden = panel.dataset.panel !== button.dataset.tab; panel.classList.toggle("is-active", panel.dataset.panel === button.dataset.tab); }); }));
  $(".undo-button").addEventListener("click", () => { if (!past.length) return; future.push(clone(state)); state = past.pop(); render(); saveState(); }); $(".redo-button").addEventListener("click", () => { if (!future.length) return; past.push(clone(state)); state = future.pop(); render(); saveState(); });
  $$('[data-color]').forEach((button) => button.addEventListener("click", () => { const previous = clone(state); state.accent = button.dataset.color; remember(previous); render(); saveState(); }));

  function resizeImage(file) { return new Promise((resolve, reject) => { if (file.size > MAX_SOURCE_IMAGE_BYTES) { reject(new Error("source-too-large")); return; } const reader = new FileReader(); reader.onerror = reject; reader.onload = () => { const image = new Image(); image.onload = () => { let ratio = Math.min(1, 1920 / image.width, 1200 / image.height); let quality = .82; let result = ""; for (let attempt = 0; attempt < 12; attempt += 1) { const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(image.width * ratio)); canvas.height = Math.max(1, Math.round(image.height * ratio)); canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height); result = canvas.toDataURL("image/jpeg", quality); const bytes = Math.ceil((result.length - result.indexOf(",") - 1) * .75); if (bytes <= MAX_STORED_IMAGE_BYTES) break; if (quality > .58) quality -= .08; else { ratio *= .82; quality = .72; } } resolve(result); }; image.onerror = reject; image.src = reader.result; }; reader.readAsDataURL(file); }); }
  async function storeImage(file, name) { const data = await resizeImage(file); return storeImageData(data, name); }
  async function storeImageData(data, name) { if (location.protocol === "file:") throw new Error("server-required"); const response = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, data }) }); if (!response.ok) throw new Error("upload-failed"); return (await response.json()).path; }
  async function migrateEmbeddedImages() {
    if (location.protocol === "file:") return;
    const seen = new Map();
    const visit = async (value, path, name) => {
      if (typeof value === "string" && value.startsWith("data:image/")) {
        if (!seen.has(value)) seen.set(value, await storeImageData(value, name));
        return seen.get(value);
      }
      if (!value || typeof value !== "object") return value;
      if (Array.isArray(value)) { for (let index = 0; index < value.length; index += 1) value[index] = await visit(value[index], `${path}-${index}`, `${path}-${index}`); return value; }
      for (const [key, child] of Object.entries(value)) value[key] = await visit(child, `${path}-${key}`, `${path}-${key}`);
      return value;
    };
    const embedded = JSON.stringify(state).match(/data:image\//g);
    if (!embedded?.length) return;
    showToast(`正在迁移 ${embedded.length} 张旧图片...`);
    try { await visit(state, "migrated", "migrated-image"); saveState(); render(); showToast("旧图片已迁移到 assets/uploads"); } catch { showToast("旧图片迁移失败，请检查 npm run dev"); }
  }
  $("[data-page-image]")?.addEventListener("change", async (event) => { const file = event.target.files?.[0]; const page = selectedPage(); if (!file || !page) return; try { const previous = clone(state); page.heroImage = await storeImage(file, `page-${page.slug}`); remember(previous); render(); saveState(); showToast("子页头图已上传到 assets/uploads"); } catch (error) { showToast(error.message === "source-too-large" ? "原图不能超过 25 MB" : error.message === "server-required" ? "请先运行 npm run dev，再使用图片上传" : "图片上传失败，请检查本地服务"); } event.target.value = ""; });
  $$('[data-image-upload]').forEach((input) => input.addEventListener("change", async () => { const file = input.files?.[0]; if (!file) return; try { const previous = clone(state); state[input.dataset.imageUpload] = await storeImage(file, `home-${input.dataset.imageUpload}`); remember(previous); render(); saveState(); showToast("图片已上传到 assets/uploads"); } catch (error) { showToast(error.message === "source-too-large" ? "原图不能超过 25 MB" : error.message === "server-required" ? "请先运行 npm run dev，再使用图片上传" : "图片上传失败，请检查本地服务"); } input.value = ""; }));
  $$('[data-collection-image]').forEach((input) => input.addEventListener("change", async () => { const file = input.files?.[0]; if (!file) return; try { const previous = clone(state); const type = input.dataset.collectionImage; state[type][activeCollection[type]].image = await storeImage(file, `${type}-${String(activeCollection[type] + 1).padStart(2, "0")}`); remember(previous); render(); saveState(); showToast("集合图片已上传到 assets/uploads"); } catch (error) { showToast(error.message === "source-too-large" ? "原图不能超过 25 MB" : error.message === "server-required" ? "请先运行 npm run dev，再使用图片上传" : "图片上传失败，请检查本地服务"); } input.value = ""; }));
  function nextConfigMeta(existing) { const pad = (value) => String(value).padStart(2, "0"); const now = new Date(); return { revision: (Number(existing?.revision) || 0) + 1, updatedAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}` }; }
  function syncConfigMetaDisplay() { const target = $("[data-config-meta]"); if (!target) return; const meta = state.configMeta; target.textContent = Number(meta?.revision) ? `config/ashfall-home-config.json：rev ${meta.revision} · ${meta.updatedAt || "时间未知"}` : "config/ashfall-home-config.json：尚未标注版本"; }
  $(".export-button").addEventListener("click", () => { state.configMeta = nextConfigMeta(state.configMeta); saveState(); const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = "ashfall-home-config.json"; link.click(); URL.revokeObjectURL(url); syncConfigMetaDisplay(); showToast("配置已导出，已标注版本"); });
  $(".save-config-button")?.addEventListener("click", async () => { if (location.protocol === "file:") { showToast("请通过 npm run dev 打开页面后再保存"); return; } const button = $(".save-config-button"); button.disabled = true; try { state.configMeta = nextConfigMeta(state.configMeta); const response = await fetch("/api/save-config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ config: clone(state) }) }); if (!response.ok) throw new Error("save-failed"); const result = await response.json(); saveState(); syncConfigMetaDisplay(); showToast(Number(result.revision) ? `已写入 config/ashfall-home-config.json（rev ${result.revision}）` : "已写入 config/ashfall-home-config.json"); } catch { showToast("写入失败：请确认页面通过 npm run dev 打开"); } finally { button.disabled = false; } });
  $(".import-button input").addEventListener("change", async (event) => { try { const previous = clone(state); state = mergeConfig(JSON.parse(await event.target.files[0].text())); remember(previous); render(); saveState(); syncConfigMetaDisplay(); showToast("配置已导入"); } catch { showToast("配置文件格式不正确"); } event.target.value = ""; });
  $(".reset-button").addEventListener("click", () => { const previous = clone(state); state = clone(defaults); remember(previous); render(); saveState(); showToast("已恢复示例内容，可撤销"); });

  function setupRail(selector, prev, next, currentAttr) { const rail = $(selector); const step = () => { const card = rail.firstElementChild; if (!card) return 0; return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).gap) || 0); }; const move = (dir) => rail.scrollBy({ left: dir * step(), behavior: "smooth" }); $(prev).addEventListener("click", () => move(-1)); $(next).addEventListener("click", () => move(1)); rail.addEventListener("scroll", () => { const index = Math.max(0, Math.min(15, Math.round(rail.scrollLeft / step()))); $(currentAttr).textContent = String(index + 1).padStart(2, "0"); setActiveNews(index); }, { passive: true }); let down = false; let startX = 0; let startScroll = 0; rail.addEventListener("pointerdown", (event) => { if (event.target.closest("a, button, input, select, textarea")) return; down = true; startX = event.clientX; startScroll = rail.scrollLeft; rail.setPointerCapture(event.pointerId); rail.classList.add("is-dragging"); }); rail.addEventListener("pointermove", (event) => { if (down) rail.scrollLeft = startScroll - event.clientX + startX; }); ["pointerup", "pointercancel"].forEach((name) => rail.addEventListener(name, () => { down = false; rail.classList.remove("is-dragging"); })); }
  setupRail(".news-rail", ".rail-prev", ".rail-next", "[data-news-current]");

  document.addEventListener("pointermove", (event) => {
    if (pickerMode && document.body.classList.contains("editor-open") && !event.target.closest(".editor")) { $$(".element-pick-hover").forEach((item) => item.classList.remove("element-pick-hover")); const target = event.target.closest("[data-element-id]"); document.documentElement.style.setProperty("--picker-x", `${event.clientX}px`); document.documentElement.style.setProperty("--picker-y", `${event.clientY}px`); if (target) target.classList.add("element-pick-hover"); }
    const element = event.target.closest(".hero, .news-card-image, .showreel, .story-media, .sustainability");
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    element.style.setProperty("--mx", String((x - .5) * 2));
    element.style.setProperty("--my", String((y - .5) * 2));
    element.style.setProperty("--light-x", `${x * 100}%`);
    element.style.setProperty("--light-y", `${y * 100}%`);
  }, { passive: true });
  document.addEventListener("click", (event) => {
    if (!pickerMode || !document.body.classList.contains("editor-open") || event.target.closest(".editor")) return;
    let target = event.target;
    while (target && target !== document.body && !elementRegistry.has(target.dataset?.elementId)) target = target.parentElement;
    if (!target || !elementRegistry.has(target.dataset.elementId)) return;
    event.preventDefault(); event.stopPropagation(); selectedElementKey = target.dataset.elementId; setPickerMode(false); $$(".editor-tabs button").find((button) => button.dataset.tab === "elements")?.click(); renderElementList(); applyElementStyles(); syncElementInspector();
  }, true);
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-home-page-link]");
    if (!target || target.matches("a")) return;
    const page = state.pages.find((item) => item.id === target.dataset.homePageLink);
    if (!page) return;
    event.preventDefault();
    location.href = pageUrl(page.slug);
  });
  document.addEventListener("keydown", (event) => {
    const target = event.target.closest('img[data-home-page-link], .item-arrow[data-home-page-link]');
    if (!target || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    target.click();
  });
  $(".footer-round")?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  });
  $(".watch-button")?.addEventListener("click", () => showToast("预告片将在下一版本上线"));
  $(".search-button")?.addEventListener("click", () => { $(".search-layer").classList.add("is-open"); $(".search-layer").setAttribute("aria-hidden", "false"); setTimeout(() => $("#site-search").focus(), 200); }); $(".search-close")?.addEventListener("click", () => { $(".search-layer").classList.remove("is-open"); $(".search-layer").setAttribute("aria-hidden", "true"); }); $(".search-form")?.addEventListener("submit", (event) => { event.preventDefault(); const query = $("#site-search").value.trim().toLowerCase(); const hits = query ? [...document.querySelectorAll("main h2, main h3, main p")].filter((el) => el.textContent.toLowerCase().includes(query)).length : 0; $(".search-result").textContent = query ? `找到 ${hits} 个相关内容` : "请输入关键词"; });
  $(".menu-button")?.addEventListener("click", () => { $(".menu-layer").classList.add("is-open"); $(".menu-layer").setAttribute("aria-hidden", "false"); }); $(".menu-close")?.addEventListener("click", () => { $(".menu-layer").classList.remove("is-open"); $(".menu-layer").setAttribute("aria-hidden", "true"); }); $(".menu-layer")?.addEventListener("click", (event) => { if (event.target.closest("a")) { $(".menu-layer").classList.remove("is-open"); $(".menu-layer").setAttribute("aria-hidden", "true"); } });
  $(".download-button")?.addEventListener("click", (event) => { if (!state.downloadUrl || state.downloadUrl === "#") { event.preventDefault(); showToast("请在编辑器中填写下载链接"); } });

  function revealInViewport() { $$(".reveal, .reveal-card, .media-reveal").forEach((element) => { const rect = element.getBoundingClientRect(); if (rect.top < window.innerHeight * .94 && rect.bottom > -40) element.classList.add("is-visible"); }); }
  let colorFrame; window.addEventListener("scroll", () => { const y = window.scrollY; $(".site-header").classList.toggle("is-scrolled", y > 40); const max = document.documentElement.scrollHeight - window.innerHeight; $(".scroll-progress span").style.width = `${max ? y / max * 100 : 0}%`; document.documentElement.style.setProperty("--hero-shift", `${Math.min(y * .04, 32)}px`); revealInViewport(); if (!colorFrame) colorFrame = requestAnimationFrame(() => { colorFrame = null; updateWordWave(); }); }, { passive: true }); window.addEventListener("resize", () => { revealInViewport(); updateWordWave(); }, { passive: true });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { if ($(".menu-layer").classList.contains("is-open")) $(".menu-close").click(); else if ($(".search-layer").classList.contains("is-open")) $(".search-close").click(); else if (document.body.classList.contains("editor-open")) toggleEditor(false); } if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && document.body.classList.contains("editor-open")) { event.preventDefault(); (event.shiftKey ? $(".redo-button") : $(".undo-button")).click(); } });

  function observeReveals() { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .08 }); $$(".reveal, .reveal-card, .media-reveal").forEach((element) => observer.observe(element)); }
  async function bootstrap() {
    const loadedBundledConfig = await loadBundledConfig();
    if (loadedBundledConfig) {
      viewPageId = initialPageSlug ? state.pages.find((page) => page.slug === initialPageSlug)?.id || "missing" : null;
      activePageId = viewPageId && viewPageId !== "missing" ? viewPageId : state.pages[0]?.id || null;
    }
    revealHeroMedia($(".hero-media"));
    if (window.lucide) window.lucide.createIcons();
    syncElementScopes();
    render(); observeReveals(); revealInViewport();
    migrateEmbeddedImages();
    syncConfigMetaDisplay();
    document.body.classList.add("page-ready");
    const params = new URLSearchParams(location.search); if (params.get("edit") === "1") { $(".edit-button").style.display = ""; toggleEditor(true); } if (viewPageId && viewPageId !== "missing") $$(".editor-tabs button").find((button) => button.dataset.tab === "pages")?.click(); if (["manifesto", "news", "expertise", "about", "research", "sustainability", "download"].includes(params.get("view"))) setTimeout(() => { document.getElementById(params.get("view"))?.scrollIntoView(); revealInViewport(); }, 60);
  }
  bootstrap();
  window.openAshfallEditor = () => { $(".edit-button").style.display = ""; toggleEditor(true); };
  window.closeAshfallEditor = () => toggleEditor(false);
})();
