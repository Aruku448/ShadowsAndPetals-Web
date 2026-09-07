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
  const EDITOR_SESSION_KEY = "ashfall-editor-open";
  let editorKeepOpen = false;
  try { editorKeepOpen = sessionStorage.getItem(EDITOR_SESSION_KEY) === "1"; } catch {}

  const defaults = {
    configVersion: 6,
    brand: "织影落花",
    kicker: "NEOFORGE 1.21.1 / 26.1.2 / 生存扩展模组",
    heroLine1: "织影落花",
    heroLine2: "Shadows",
    heroLine3: "&Petals",
    heroSummary: "禅意，是Minecraft里的永恒语言",
    manifestoEyebrow: "一款以和风美学为核心的装饰&农业模组",
    manifestoBody: "“庭院，四季，耕作”\n\n我们通过这三个元素，在模组内加入了兼具观赏性与实用性的装饰，家具，作物，环境等细节\n\n“物哀，幽玄，侘寂”\n\n我们通过这三个元素，力图让玩家们在自己的Minecraft世界中找到精神上的和风世界",
    newsTitle: "最新动态",
    newsBody: "从月度更新公告，到参与活动介绍，再到一些学术上的展示，您都能在这里浏览",
    expertiseTitle: "关于我们的一切",
    expertiseBody: "从织影落花模组的视觉化方块\n抑或是织影落花的听觉化表达\n这里有太多的元素等大家了解",
    aboutTitle: "关于\n我们的诞生",
    aboutBody: "织影落花模组的诞生\n是我们在背后的不断努力\n当然也有大家的不断支持",
    researchTitle: "花开花落\n总会再有一年",
    researchBody: "织影落花模组的终点\n无论什么时候问我们\n答案永远会是“明年”\n那么我们在这一年又会做些什么？\n\n",
    sustainabilityTitle: "我们需要您的反馈",
    sustainabilityBody: "诚邀您与我们\n一起完善\n《织影落花集》",
    downloadTitle: "诚邀您\n翻开我们这本\n《织影落花集》",
    downloadLabel: "下载 V1.0 teacon",
    downloadUrl: "https://github.com/SShakusora/ShadowsAndPetals/tree/26.1.2/Teacon",
    version: "V2.4.0",
    releaseDate: "2026.08.21",
    loader: "Neoforge 1.21.1 / 26.1.2",
    trailerVideo: "",
    trailerImage: "assets/news-cavern.png",
    accent: "#DDFD5A",
    heroShade: 34,
    heroFocus: 52,
    textureGrain: 5,
    mediaHighlight: 24,
    glassOpacity: 56,
    headerTopOpacity: 0,
    headerScrolledOpacity: 84,
    headerBlur: 14,
    headerBorder: 0,
    headerLightOnScroll: true,
    editorOpacity: 96,
    elementStyles: {},
    customElements: [],
    homeLinks: {},
    pages: [
      {
        id: "page-world-systems",
        parentId: null,
        slug: "2026-teacon",
        tags: ["展会"],
        navLabel: "2026 TeaCon展会",
        eyebrow: "2026TeaCon",
        title: "2026 TeaCon 展会\n织影落花 的 初次见面",
        summary: "在2026年的最后一个季度，我们终于要向大家展示《织影落花集》了......",
        contentTitle: "《织影落花集·九月》—— 远在远方的风",
        body: "织影落花Mod在2026年第四季度的TeaCon展览会[1]上首次亮相，看看在这次展览会上我们有什么点值得大家记住吧：",
        heroImage: "assets/uploads/migrated-pages-0-heroimage-1788283442540-2852dd.jpeg",
        ctaLabel: "对我们Mod感兴趣吗？点击这里下载",
        ctaUrl: "./index.html#download",
        published: false,
        midiData: "",
        midiName: "",
        midiTrack: null,
      },
    ],
    heroImage: "assets/hero-ashfall.png",
    aboutImage: "assets/about-team.png",
    researchImage: "assets/research-lab.png",
    sustainabilityImage: "assets/sustainability-world.png",
    news: [
      ["版本", "2026.08.21", "V2.4.0：灰烬气候正式上线", "新增火山灰事件、地热增压与六种适应性植被。", "assets/news-cavern.png"],
      ["开发日志", "2026.08.14", "世界生成器开始重构", "新的地形规则让每次远征都拥有不同的资源脉络。", "assets/feature-ecology.png"],
      ["社区", "2026.08.02", "织影落花建筑挑战赛开启", "用一周时间，把最危险的群系变成最值得居住的地方。", "assets/about-team.png"],
      ["机制", "2026.07.19", "天气系统进入多人测试", "气压、温度和海拔现在会在服务器间稳定同步。", "assets/feature-weather.png"],
      ["研究", "2026.07.06", "地热网络的第一张图纸", "能源不是凭空出现，新的生产线需要理解地下热流。", "assets/research-lab.png"],
      ["发布", "2026.06.22", "V2.3.0：深层矿脉", "六种矿物与一套新的矿井照明系统已加入游戏。", "assets/feature-machinery.png"],
      ["社区", "2026.06.10", "与建筑师一起做 Mod", "开放一场关于空间、路径与玩家记忆的线上工作坊。", "assets/about-team.png"],
      ["系统", "2026.05.26", "可迁移存档实验完成", "跨版本迁移不再抹掉你的世界历史与自定义规则。", "assets/sustainability-world.png"],
      ["合作", "2026.05.13", "织影落花 x 星尘服务器", "首个大型公共服务器开始邀请玩家参与压力测试。", "assets/news-cavern.png"],
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

  function normalizePageTags(value) {
    const values = Array.isArray(value) ? value : String(value || "").split(/[,，、\n]/);
    return [...new Set(values.map((tag) => String(tag ?? "").trim()).filter(Boolean))].slice(0, 3);
  }

  function mergeConfig(input = {}) {
    const merged = { ...clone(defaults), ...input };
    merged.elementStyles = { ...clone(defaults.elementStyles), ...(input.elementStyles || {}) };
    merged.customElements = Array.isArray(input.customElements) ? input.customElements : [];
    merged.pages = Array.isArray(input.pages) ? input.pages.map((page, index) => ({ ...clone(defaults.pages[0]), ...page, id: page.id || `page-${index + 1}`, tags: normalizePageTags(page.tags ?? page.eyebrow) })) : clone(defaults.pages);
    // 文章管理不再使用父子关系；保留旧字段仅用于兼容已有配置，不参与展示或导航。
    merged.pages.forEach((page) => { page.parentId = null; });
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
    if (merged.kicker === "FORGE 1.20.1 / 生存扩展模组") merged.kicker = "NEOFORGE 1.21.1 / 26.1.2 / 生存扩展模组";
    if (merged.loader === "Forge 1.20.1") merged.loader = "Neoforge 1.21.1 / 26.1.2";
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
  const collapsedElementIds = new Set();
  let elementRegistry = new Map();
  let pickerMode = false;
  const initialPageSlug = new URLSearchParams(location.search).get("page");
  let viewPageId = initialPageSlug ? state.pages.find((page) => page.slug === initialPageSlug)?.id || "missing" : null;
  let activePageId = viewPageId && viewPageId !== "missing" ? viewPageId : state.pages[0]?.id || null;
  const collapsedPageIds = new Set();

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
  function pageUrl(slug, returnUrl = "") { const params = new URLSearchParams({ page: slug }); if (returnUrl) params.set("from", returnUrl); if (new URLSearchParams(location.search).get("edit") === "1" || document.body.classList.contains("editor-open")) params.set("edit", "1"); return `./index.html?${params}`; }
  function isIndexPath(pathname) { return ["/", "/index.html"].includes(String(pathname || "/")); }
  function localDevHost(hostname) { return ["localhost", "127.0.0.1", "0.0.0.0"].includes(String(hostname || "")); }
  function sitePageFromUrl(href) {
    try {
      const url = new URL(href, location.href);
      const slug = url.searchParams.get("page");
      if (!slug || !isIndexPath(url.pathname)) return null;
      const sameSite = url.origin === location.origin;
      const devLocalLink = localDevHost(url.hostname);
      const productionSiteLink = /(^|\.)shadowsandpetals\.com$/i.test(url.hostname);
      if (!sameSite && !devLocalLink && !productionSiteLink) return null;
      if (!state.pages.some((page) => page.slug === slug)) return null;
      return { url, slug };
    } catch { return null; }
  }
  function normalizeMarkdownLinks(body) {
    body.querySelectorAll("a").forEach((link) => {
      const pageLink = sitePageFromUrl(link.getAttribute("href") || "");
      if (pageLink) {
        link.href = pageUrl(pageLink.slug);
        link.removeAttribute("target");
        link.removeAttribute("rel");
        return;
      }
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }
  function selectedPage() { return state.pages.find((page) => page.id === activePageId) || null; }
  function viewedPage() { return state.pages.find((page) => page.id === viewPageId) || null; }
  function cleanSlug(value) { return String(value || "page").trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff-]+/g, "-").replace(/^-+|-+$/g, "") || "page"; }
  function uniqueSlug(value, exceptId = null) { const base = cleanSlug(value); let slug = base; let suffix = 2; while (state.pages.some((page) => page.id !== exceptId && page.slug === slug)) slug = `${base}-${suffix++}`; return slug; }
  function syncViewedPageFromLocation() {
    const slug = new URLSearchParams(location.search).get("page");
    const page = slug ? state.pages.find((item) => item.slug === slug) : null;
    viewPageId = slug ? page?.id || "missing" : null;
    activePageId = page?.id || state.pages[0]?.id || null;
    return page;
  }
  function previewPage(id) { const page = state.pages.find((item) => item.id === id); if (!page) return; viewPageId = page.id; activePageId = page.id; history.pushState(null, "", pageUrl(page.slug)); selectedElementKey = null; render(); window.scrollTo({ top: 0, behavior: "auto" }); }

  function previewPageFromUrl(url) { history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`); syncViewedPageFromLocation(); selectedElementKey = null; render(); window.scrollTo({ top: 0, behavior: "auto" }); return viewPageId !== "missing"; }

  function playPageInstanceTransition(container) {
    if (!container) return;
    container.classList.remove("page-instance-entering");
    void container.offsetWidth;
    container.classList.add("page-instance-entering");
  }
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

  function renderPageNavigation() {}

  function pageDirectoryUrl(page = 1, category = "", query = "") { const params = new URLSearchParams({ view: "pages", page: String(page) }); if (category) params.set("tag", category); if (query) params.set("q", query); if (new URLSearchParams(location.search).get("edit") === "1" || document.body.classList.contains("editor-open")) params.set("edit", "1"); return `./index.html?${params}`; }
  function applyDirectoryImageRatio(image) {
    if (!image?.naturalWidth || !image.naturalHeight) return;
    const ratio = Math.min(1.55, Math.max(.82, image.naturalWidth / image.naturalHeight));
    image.parentElement?.style.setProperty("--directory-image-ratio", ratio.toFixed(3));
  }

  function scrollDirectoryToHeroBottom() {
    const hero = $("[data-page-directory] .directory-hero");
    const header = $(".site-header");
    if (!hero) return;
    const top = window.scrollY + hero.getBoundingClientRect().bottom - (header?.offsetHeight || 0);
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }

  function renderPageDirectory({ animate = true } = {}) {
    const directory = $("[data-page-directory]");
    if (!directory) return;
    const params = new URLSearchParams(location.search);
    const currentPage = Math.max(1, Number(params.get("page")) || 1);
    const category = params.get("tag") || "";
    const query = params.get("q") || "";
    const allPages = state.pages.filter((page) => (!category || (page.tags || []).includes(category)) && (!query || normalizeSearchText(searchPageText(page)).includes(normalizeSearchText(query))));
    const categories = [...new Set(state.pages.flatMap((page) => page.tags || []))].sort((a, b) => a.localeCompare(b, "zh-CN"));
    const pageSize = 6;
    const totalPages = Math.max(1, Math.ceil(allPages.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const items = allPages.slice((safePage - 1) * pageSize, safePage * pageSize);
    const directoryHeroImages = [...new Set(items.map((page) => page.heroImage).filter(Boolean))];
    for (let index = directoryHeroImages.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [directoryHeroImages[index], directoryHeroImages[swapIndex]] = [directoryHeroImages[swapIndex], directoryHeroImages[index]];
    }
    const wallImages = directoryHeroImages.length ? directoryHeroImages : ["assets/hero-ashfall.png"];
    directory.hidden = false;
    directory.innerHTML = `<section class="directory-hero"><div class="section-tag"><span>07</span><p>文章 / Archive</p></div><div><h1>织影落花集<br /><br /><br /></h1><p>通过标签浏览文章。文章之间彼此独立，不再受页面层级限制。</p></div></section><section class="directory-toolbar"><div class="directory-toolbar-controls"><form class="directory-search" data-directory-search-form><label for="directory-search-input">搜索文章</label><div><i data-lucide="search" aria-hidden="true"></i><input id="directory-search-input" type="search" data-directory-search value="${escapeHTML(query)}" placeholder="标题、摘要或正文" /><button class="icon-button" type="submit" aria-label="搜索文章" data-tooltip="搜索"><i data-lucide="arrow-right"></i></button></div></form><div class="directory-filter"><span class="directory-filter-title">按标签筛选</span><button class="directory-filter-trigger" type="button" data-directory-category-trigger aria-haspopup="listbox" aria-expanded="false"><span data-directory-category-label>${escapeHTML(category || "全部文章")}</span><i data-lucide="chevron-down" aria-hidden="true"></i></button><div class="page-outline-panel directory-filter-menu" data-directory-category-menu aria-label="按标签筛选" hidden><div class="outline-header"><span>按标签筛选</span><button class="icon-button outline-close" type="button" data-directory-category-close aria-label="关闭筛选"><i data-lucide="x" aria-hidden="true"></i></button></div><nav>${["", ...categories].map((item) => `<a href="#" class="outline-level-3${item === category ? " is-active" : ""}" data-category-value="${escapeHTML(item)}">${item ? escapeHTML(item) : "全部文章"}</a>`).join("")}</nav></div></div></div><p>${allPages.length} 篇文章</p></section><section class="directory-grid">${items.map((page, index) => `<a class="directory-card${index === 0 && safePage === 1 ? " directory-card-featured" : ""}" href="${pageUrl(page.slug, `${location.pathname}${location.search}`)}"><div class="directory-card-image story-media"><img src="${escapeHTML(page.heroImage)}" alt="" loading="lazy" decoding="async" data-directory-card-image /></div><div class="directory-card-content"><div class="directory-card-tags">${(page.tags || []).map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div><h2>${escapeHTML(page.title || "未命名页面").replace(/\n/g, "<br />")}</h2><p>${escapeHTML(page.summary || "暂无摘要")}</p><i data-lucide="arrow-up-right"></i></div></a>`).join("")}</section><nav class="directory-pagination" aria-label="文章分页">${Array.from({ length: totalPages }, (_, index) => `<a href="${pageDirectoryUrl(index + 1, category, query)}"${index + 1 === safePage ? " aria-current=\"page\"" : ""}>${String(index + 1).padStart(2, "0")}</a>`).join("")}</nav>`;
    const hero = directory.querySelector(".directory-hero");
    if (hero) {
      hero.classList.add("directory-hero-cover");
      const wall = document.createElement("div"); wall.className = "directory-hero-wall"; wall.setAttribute("aria-hidden", "true");
      const wallRows = 5;
      wall.innerHTML = Array.from({ length: wallRows }, (_, row) => {
        const rowImages = [...wallImages.slice(row % wallImages.length), ...wallImages.slice(0, row % wallImages.length)];
        const sources = [...rowImages, ...rowImages, ...rowImages];
        return `<div class="directory-hero-wall-track" style="--wall-row:${row}">${sources.map((source) => `<img class="directory-hero-wall-tile" src="${escapeHTML(source)}" alt="" loading="eager" decoding="async" />`).join("")}</div>`;
      }).join("");
      hero.prepend(wall);
      const overlay = document.createElement("div"); overlay.className = "directory-hero-overlay"; overlay.setAttribute("aria-hidden", "true"); hero.prepend(overlay);
      const back = document.createElement("a"); back.className = "directory-back"; back.href = homeUrl(); back.dataset.homeLink = ""; back.innerHTML = '<span aria-hidden="true">←</span> 首页'; hero.append(back);
    }
    directory.querySelectorAll("[data-directory-card-image]").forEach((image) => { image.addEventListener("load", () => applyDirectoryImageRatio(image), { once: true }); applyDirectoryImageRatio(image); });
    const directorySearch = directory.querySelector("[data-directory-search]");
    directorySearch?.addEventListener("input", (event) => {
      const value = event.target.value.trim();
      const url = new URL(location.href);
      url.searchParams.set("view", "pages");
      url.searchParams.set("page", "1");
      if (value) url.searchParams.set("q", value); else url.searchParams.delete("q");
      history.replaceState(null, "", `${url.pathname}${url.search}`);
      renderPageDirectory();
      const nextSearch = directory.querySelector("[data-directory-search]");
      if (nextSearch) { nextSearch.focus(); nextSearch.setSelectionRange(value.length, value.length); }
    });
    directory.querySelector("[data-directory-search-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      directorySearch?.dispatchEvent(new Event("input", { bubbles: true }));
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function revealHeroMedia(image) {
    if (!image) return;
    const reveal = () => requestAnimationFrame(() => { if (image.isConnected) image.classList.add("is-loaded"); });
    image.addEventListener("load", reveal);
    if (image.complete && image.naturalWidth) reveal();
  }

  function midiNoteToAbc(midi) {
    const names = ["C", "^C", "D", "^D", "E", "F", "^F", "G", "^G", "A", "^A", "B"];
    const octave = Math.floor(midi / 12) - 1;
    let note = names[midi % 12];
    if (octave >= 5) note = note.toLowerCase() + "'".repeat(Math.max(0, octave - 5));
    else if (octave < 4) note += ",".repeat(Math.max(0, 4 - octave));
    return note;
  }

  function dataUrlToMidiBytes(value) {
    const encoded = String(value).split(",")[1];
    if (!encoded) throw new Error("invalid-midi-data");
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function parseMidi(data) {
    const MidiParser = window.Midi?.Midi || window.Midi;
    if (typeof MidiParser !== "function") throw new Error("midi-parser-unavailable");
    return new MidiParser(data);
  }

  function midiTrackEntries(data) {
    const midi = parseMidi(data);
    return midi.tracks.map((track, index) => ({ index, track })).filter(({ track }) => track.notes.length);
  }

  const midiInstrumentNames = { clarinet: "单簧管", basson: "巴松管", bassoon: "巴松管", piano: "钢琴", flute: "长笛", violin: "小提琴", cello: "大提琴", tuba: "大号", horn: "圆号", trombone: "长号", oboe: "双簧管" };
  function midiTrackDisplayName(fileName, track) {
    const baseName = midiBaseName(fileName);
    const rawName = String(track.name || track.instrument?.name || "未命名声部").replace(/[\r\n]/g, " ").trim() || "未命名声部";
    const key = rawName.toLowerCase().replace(/\s+/g, "");
    const chineseName = midiInstrumentNames[key] || (track.instrument?.name === "acoustic grand piano" ? "钢琴" : "乐器声部");
    return `${baseName} - ${rawName} (${chineseName})`;
  }
  function midiTrackShortName(track) {
    return String(track.name || track.instrument?.name || "未命名声部").replace(/[\r\n]/g, " ").trim() || "未命名声部";
  }
  function midiBaseName(fileName) {
    return String(fileName || "MIDI").replace(/\.(?:mid|midi)$/i, "").trim() || "MIDI";
  }
  function midiTrackOutlineParts(track) {
    const rawName = midiTrackShortName(track);
    const key = rawName.toLowerCase().replace(/\s+/g, "");
    const chineseName = midiInstrumentNames[key] || (track.instrument?.name === "acoustic grand piano" ? "钢琴" : "乐器声部");
    return { rawName, chineseName };
  }
  function midiTrackOutlineName(track) {
    const { rawName, chineseName } = midiTrackOutlineParts(track);
    return `${rawName} (${chineseName})`;
  }

  function midiTrackLabel(entry) {
    const { index, track } = entry;
    const name = String(track.name || track.instrument?.name || "未命名声部").replace(/[^\x20-\x7e\u4e00-\u9fff]/g, "").trim() || "未命名声部";
    return `${String(index + 1).padStart(2, "0")} · ${name} · ${track.notes.length} 音符`;
  }

  function pianoSplitPoint(track) {
    const pitches = [...new Set(track.notes.map((note) => note.midi))].sort((a, b) => a - b);
    const candidates = pitches.slice(0, -1).map((pitch, index) => ({ pitch, gap: pitches[index + 1] - pitch, left: track.notes.filter((note) => note.midi <= pitch).length, right: track.notes.filter((note) => note.midi > pitch).length })).filter((item) => item.pitch >= 55 && item.pitch <= 78 && item.gap > 1);
    const strongSplit = candidates.find((item) => item.pitch >= 68 && item.pitch <= 74 && item.right > item.left * 1.4);
    return strongSplit?.pitch || 60;
  }
  function quantizeMidiUnits(ticks, unit, minimum = 0) {
    return Math.max(minimum, Math.round(ticks / unit));
  }
  function groupMidiNotes(notes, unit, nearThreshold = 0) {
    const groups = [];
    [...notes].sort((a, b) => a.ticks - b.ticks || a.midi - b.midi).forEach((note) => {
      const start = quantizeMidiUnits(note.ticks, unit);
      const last = groups.at(-1);
      const delta = last ? note.ticks - last.startTick : Infinity;
      const sameGrid = last && start === last.start;
      const nearStart = last && delta >= 0 && delta <= nearThreshold && last.start < 64 && start < 64;
      if (!last || (!sameGrid && !nearStart)) groups.push({ start, startTick: note.ticks, values: [note] });
      else last.values.push(note);
    });
    const grouped = new Map();
    groups.forEach((group) => { if (!grouped.has(group.start)) grouped.set(group.start, []); grouped.get(group.start).push(...group.values.map((note) => ({ midi: note.midi, ticks: note.ticks, duration: Math.max(1, quantizeMidiUnits(note.durationTicks, unit)) }))); });
    return grouped;
  }

  function midiToAbc(data, name = "MIDI", selectedTrack = null, noteRange = null, clef = "treble") {
    const midi = parseMidi(data);
    const entries = midi.tracks.map((track, index) => ({ index, track })).filter(({ track }) => track.notes.length);
    const selected = entries.find(({ index }) => index === Number(selectedTrack)) || entries[0];
    if (!selected) throw new Error("midi-empty");
    const notes = [...selected.track.notes].filter((note) => !noteRange || noteRange(note.midi)).sort((a, b) => a.ticks - b.ticks || b.midi - a.midi).slice(0, 4000);
    const unit = Math.max(1, midi.header.ppq / 4);
    const grouped = groupMidiNotes(notes, unit);
    const events = [...grouped.entries()].map(([start, values], index, all) => ({ start: Number(start), notes: [...new Set(values.map((value) => value.midi))].sort((a, b) => a - b).map(midiNoteToAbc), arpeggio: false, duration: Math.max(1, Math.min(Math.max(...values.map((value) => value.duration)), (all[index + 1] ? Number(all[index + 1][0]) : Infinity) - Number(start))) }));
    const tokens = []; let cursor = 0; let barUnits = 0;
    const readableDurations = [16, 12, 8, 6, 4, 3, 2, 1];
    const append = (note, length) => {
      let remaining = length;
      while (remaining > 0) {
        const room = 16 - barUnits;
        const amount = readableDurations.find((duration) => duration <= Math.min(remaining, room)) || 1;
        remaining -= amount;
        tokens.push(`${note}${amount > 1 ? amount : ""}${note !== "z" && remaining > 0 ? "-" : ""}`);
        barUnits += amount;
        if (barUnits === 16) { tokens.push("|"); barUnits = 0; }
      }
    };
    events.forEach((event) => { if (event.start > cursor) append("z", event.start - cursor); const note = event.notes.length > 1 ? `${event.arpeggio ? "!arpeggio!" : ""}[${event.notes.join("")}]` : event.notes[0]; append(note, event.duration); cursor = Math.max(cursor, event.start + event.duration); });
    const trackName = midiTrackDisplayName(name, selected.track);
    return `X:1\nM:4/4\nL:1/16\nK:C clef=${clef}\n${tokens.join(" ")}`;
  }

  function midiToGrandStaffAbc(data, name, selectedTrack, splitPoint) {
    const midi = parseMidi(data);
    const selected = midi.tracks[selectedTrack];
    if (!selected?.notes.length) throw new Error("midi-empty");
    const unit = Math.max(1, midi.header.ppq / 4);
    const makeVoice = (range) => {
      const notes = selected.notes.filter((note) => range(note.midi)).sort((a, b) => a.ticks - b.ticks || b.midi - a.midi);
      const grouped = groupMidiNotes(notes, unit, 48);
      const entries = [...grouped.entries()]; const events = entries.map(([start, values], index) => ({ start: Number(start), notes: [...new Set(values.map((value) => value.midi))].sort((a, b) => a - b).map(midiNoteToAbc), arpeggio: values.length >= 2 && ((Number(start) < 64 && Math.max(...values.map((value) => value.ticks)) - Math.min(...values.map((value) => value.ticks)) <= unit * 2) || (values.length >= 3 && Math.max(...values.map((value) => value.midi)) - Math.min(...values.map((value) => value.midi)) >= 12 && Math.max(...values.map((value) => value.ticks)) - Math.min(...values.map((value) => value.ticks)) <= unit * 2 && Math.max(...values.map((value) => value.ticks)) > Math.min(...values.map((value) => value.ticks)))),duration: Math.max(1, Math.min(Math.max(...values.map((value) => value.duration)), (entries[index + 1] ? Number(entries[index + 1][0]) : Infinity) - Number(start))) }));
      const tokens = []; const readable = [16, 12, 8, 6, 4, 3, 2, 1]; let cursor = 0; let bar = 0;
      const append = (note, length) => { let remaining = length; while (remaining > 0) { const amount = readable.find((value) => value <= Math.min(remaining, 16 - bar)) || 1; remaining -= amount; tokens.push(`${note}${amount > 1 ? amount : ""}${note !== "z" && remaining > 0 ? "-" : ""}`); bar += amount; if (bar === 16) { tokens.push("|"); bar = 0; } } };
      events.forEach((event) => { if (event.start > cursor) append("z", event.start - cursor); const note = event.notes.length > 1 ? `${event.arpeggio ? "!arpeggio!" : ""}[${event.notes.join("")}]` : event.notes[0]; append(note, event.duration); cursor = Math.max(cursor, event.start + event.duration); });
      return tokens.join(" ");
    };
    return `X:1\nM:4/4\nL:1/16\n%%staves {RH LH}\nV:RH clef=treble\nV:LH clef=bass\nK:C\n[V:RH] ${makeVoice((midi) => midi > splitPoint)}\n[V:LH] ${makeVoice((midi) => midi <= splitPoint)}`;
  }

  function renderMidiStaff(staff) {
    if (staff.dataset.rendered === "true") return;
    const { midiData, midiName, trackIndex, piano, splitPoint, clef } = staff.dataset;
    const score = staff.querySelector(".midi-score");
    if (!score) return;
    staff.classList.add("is-rendering");
    score.textContent = "";
    try {
      const data = dataUrlToMidiBytes(midiData);
      const availableWidth = document.querySelector("[data-page-markdown]")?.clientWidth || 1140;
      const staffwidth = Math.max(520, Math.min(1100, availableWidth - 40));
      const abc = piano === "true" ? midiToGrandStaffAbc(data, midiName, Number(trackIndex), Number(splitPoint)) : midiToAbc(data, midiName, Number(trackIndex), null, clef || "treble");
      window.ABCJS.renderAbc(score, abc, { responsive: "resize", add_classes: true, staffwidth, wrap: { preferredMeasuresPerLine: 4, minSpacing: 1.5, minSpacingLimit: 1.1 } });
      staff.dataset.rendered = "true";
      requestAnimationFrame(() => { staff.classList.remove("is-rendering"); staff.classList.add("is-expanded"); });
    } catch {
      staff.dataset.rendered = "error";
      score.textContent = "MIDI 文件无法解析或没有音符。";
    }
  }
  function collapseMidiStaff(staff) {
    if (!staff || staff.dataset.rendered !== "true") return;
    staff.classList.remove("is-expanded");
    staff.dataset.rendered = "false";
    const score = staff.querySelector(".midi-score");
    if (!score) return;
    setTimeout(() => {
      if (!staff.classList.contains("is-expanded")) {
        score.replaceChildren();
        score.removeAttribute("style");
        score.removeAttribute("width");
        score.removeAttribute("height");
      }
    }, 420);
  }
  function setAllMidiStaffs(figure, render) {
    if (!figure) return;
    figure.querySelectorAll(".midi-staff").forEach((staff) => {
      if (render) {
        if (staff.dataset.rendered !== "true") renderMidiStaff(staff);
      } else if (staff.dataset.rendered === "true") collapseMidiStaff(staff);
    });
  }
  function midiFigure(page) {
    if (!page.midiData || !window.ABCJS) return null;
    const figure = document.createElement("figure");
    figure.className = "markdown-embed-tool markdown-midi";
    figure.innerHTML = `<div class="midi-score-list"></div>`;
    try {
      const data = dataUrlToMidiBytes(page.midiData);
      const tracks = midiTrackEntries(data);
      const list = figure.querySelector(".midi-score-list");
      if (!tracks.length) throw new Error("midi-empty");
      tracks.forEach((entry, trackPosition) => {
        const trackLabel = midiTrackLabel(entry);
        const isPiano = /piano|键盘|钢琴/i.test(String(entry.track.name || ""));
        const group = document.createElement("section");
        group.className = `midi-track-group${isPiano ? " midi-piano-group" : ""}`;
        list.append(group);
        if (isPiano) {
          const splitPoint = pianoSplitPoint(entry.track);
          const staff = document.createElement("section");
          staff.className = "midi-staff midi-grand-staff";
          staff.id = `midi-score-${entry.index}`;
          staff.innerHTML = `<h3><span class="midi-staff-title">${escapeHTML(midiBaseName(page.midiName))}</span><button type="button" class="midi-staff-trigger"><span class="midi-staff-name">${escapeHTML(midiTrackShortName(entry.track))}</span></button></h3><div class="midi-score"></div>`;
          staff.dataset.midiData = page.midiData;
          staff.dataset.midiName = page.midiName || "MIDI";
          staff.dataset.trackIndex = entry.index;
          staff.dataset.piano = "true";
          staff.dataset.splitPoint = splitPoint;
          group.append(staff);
          if (trackPosition === 0) renderMidiStaff(staff);
          return;
        }
        const staffEntries = [{ label: trackLabel, clef: "treble", range: null }];
        staffEntries.forEach((staffEntry) => {
          const staff = document.createElement("section");
          staff.className = "midi-staff";
          staff.id = `midi-score-${entry.index}`;
          staff.innerHTML = `<h3><span class="midi-staff-title">${escapeHTML(midiBaseName(page.midiName))}</span><button type="button" class="midi-staff-trigger"><span class="midi-staff-name">${escapeHTML(midiTrackShortName(entry.track))}</span></button></h3><div class="midi-score"></div>`;
          staff.dataset.midiData = page.midiData;
          staff.dataset.midiName = page.midiName || "MIDI";
          staff.dataset.trackIndex = entry.index;
          staff.dataset.clef = staffEntry.clef;
          group.append(staff);
          if (trackPosition === 0) renderMidiStaff(staff);
        });
      });
    }
    catch { figure.classList.add("is-error"); figure.querySelector(".midi-score").textContent = "MIDI 文件无法解析或没有音符。"; }
    return figure;
  }

  const embeddedToolRenderers = {
    midi: (page) => midiFigure(page),
    mid: (page) => midiFigure(page),
  };

  function renderEmbeddedTools(body, page) {
    body.querySelectorAll("pre > code[class*='language-']").forEach((code) => {
      const toolName = [...code.classList].find((className) => className.startsWith("language-"))?.slice(9).toLowerCase();
      const renderer = embeddedToolRenderers[toolName];
      if (!renderer) return;
      const tool = renderer(page);
      if (tool) code.parentElement.replaceWith(tool);
    });
  }

  function markdownSource(source) {
    const emoji = { smile: "😄", heart: "❤️", rocket: "🚀", sparkles: "✨", fire: "🔥", tada: "🎉", warning: "⚠️", check: "✅", x: "❌" };
    return source
      .replace(/^([^\n:]+)\n: ([^\n]+)$/gm, "<dl><dt>$1</dt><dd>$2</dd></dl>")
      .replace(/^\$\$\s*\n?([\s\S]*?)\n?\$\$$/gm, (_, math) => `\`\`\`math\n${math}\n\`\`\``)
      .replace(/(^|[^\\])\$([^$\n]+)\$/g, (_, prefix, math) => `${prefix}<code class="language-math">${math}</code>`)
      .replace(/:([a-z0-9_+-]+):/gi, (match, name) => emoji[name.toLowerCase()] || match);
  }

  function formatLegacyPage(source, slug) {
    if (slug === "update2026-3") return source
      .replace(/^>\s*【([^】\n]+)】相关更新：\s*$/gm, "### $1相关更新")
      .replace(/^>\s*$/gm, "")
      .replace(/^>\s?/gm, "")
      .replace(/^\t+/gm, (tabs) => "  ".repeat(Math.min(tabs.length, 3)));
    if (slug === "contactus") return source.replace(/^\s*([①②③④⑤])：\s*/gm, (_, marker) => `${"①②③④⑤".indexOf(marker) + 1}. `);
    if (slug === "academic-jhana") return source
      .replace(/^【(“公家”和“武家”分别是什么？|雅韵：时间的记忆|禅宗：雅韵的对板)】\s*$/gm, "### $1")
      .replace(/^【([^】\n]+)】\s*$/gm, "> **$1**");
    if (slug === "memberlist") {
      const marker = "以下人员按照首字母顺序排列，并不代表贡献高低";
      return source
        .replace(new RegExp(`^【${marker}】\\s*$`, "m"), `### ${marker}`)
        .replace(new RegExp(`(### ${marker}\\n)([\\s\\S]*)$`), (_, heading, names) => `${heading}\n${names.replace(/^\\s*(\\S.*)$/gm, "- $1")}`);
    }
    return source;
  }

  function pageMarkdown(page) {
    const source = formatLegacyPage(markdownSource(String(page.body || "")), page.slug);
    if (!window.marked || !window.DOMPurify) return `<p>${escapeHTML(source).replace(/\n/g, "<br />")}</p>`;
    const parser = window.markedFootnote ? new window.marked.Marked().use(window.markedFootnote()) : window.marked;
    const raw = parser.parse(source, { gfm: true, breaks: true, headerIds: false });
    return window.DOMPurify.sanitize(raw, { ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "ul", "ol", "li", "blockquote", "strong", "em", "del", "u", "code", "pre", "a", "img", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "input", "dl", "dt", "dd", "sup", "section", "div", "span"], ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class", "id", "style", "align", "colspan", "rowspan", "type", "checked", "disabled"] });
  }

  async function enhanceMarkdown(body) {
    if (window.katex) body.querySelectorAll("code.language-math").forEach((code) => {
      const display = code.parentElement?.tagName === "PRE";
      const target = display ? code.parentElement : code;
      try { window.katex.render(code.textContent.trim(), target, { displayMode: display, throwOnError: false }); } catch { /* Keep the sanitized code fallback. */ }
    });
    if (!window.mermaid) return;
    const nodes = [...body.querySelectorAll("pre > code.language-mermaid")];
    if (!nodes.length) return;
    try {
      const rendered = await Promise.all(nodes.map(async (code, index) => {
        const id = `mermaid-${Date.now()}-${index}`;
        const { svg } = await window.mermaid.render(id, code.textContent);
        return { code, svg };
      }));
      rendered.forEach(({ code, svg }) => { const figure = document.createElement("figure"); figure.className = "markdown-mermaid"; figure.innerHTML = svg; code.parentElement.replaceWith(figure); });
    } catch { /* Keep source code when Mermaid rejects a diagram. */ }
  }

  function buildPageOutline(container) {
    const headings = [...container.querySelectorAll("h2, h3")].filter((heading) => !heading.closest(".midi-staff"));
    const usedIds = new Set();
    const slugify = (text, index) => { const base = String(text).trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-+|-+$/g, "") || `section-${index + 1}`; let id = `article-${base}`; let suffix = 2; while (usedIds.has(id)) id = `article-${base}-${suffix++}`; usedIds.add(id); return id; };
    headings.forEach((heading, index) => { heading.id = slugify(heading.textContent, index); });
    const outline = $("[data-page-outline]");
    if (!outline) return;
    const midiFigures = [...container.querySelectorAll(".markdown-midi")];
    const midiControls = midiFigures.map((figure, index) => `<button type="button" class="outline-midi-all" data-midi-render-all="${index}" aria-pressed="false"><span class="outline-midi-symbol">+</span><span>全部声部</span></button>`).join("");
    const headingLinks = headings.map((heading) => `<a class="outline-level-${heading.tagName.slice(1)}" href="#${heading.id}">${escapeHTML(heading.textContent)}</a>`).join("");
    const staffLinks = [...container.querySelectorAll(".midi-staff")].map((staff) => {
      const { rawName, chineseName } = midiTrackOutlineParts({ name: staff.querySelector(".midi-staff-name")?.textContent || "未命名声部" });
      return `<button type="button" class="outline-level-3 outline-midi-staff-link" data-midi-staff-link="${staff.id}"><span class="outline-midi-instrument">${escapeHTML(rawName)}</span><span class="outline-midi-native">(${escapeHTML(chineseName)})</span></button>`;
    }).join("");
    outline.innerHTML = midiControls + (headingLinks || staffLinks ? headingLinks + staffLinks : `<p class="outline-empty">暂无章节</p>`);
    outline.querySelectorAll("[data-midi-staff-link]").forEach((link) => link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const staff = document.getElementById(link.dataset.midiStaffLink);
      if (!staff) return;
      closePageOutline();
      renderMidiStaff(staff);
      requestAnimationFrame(() => staff.scrollIntoView({ behavior: "smooth", block: "start" }));
    }));
  }

  function updatePageOutlineActive() {
    const body = $("[data-page-markdown]");
    const links = $$('[data-page-outline] a');
    if (!body || !links.length) return;
    const headings = [...body.querySelectorAll("h2, h3")];
    let activeIndex = 0;
    headings.forEach((heading, index) => { if (heading.getBoundingClientRect().top <= 150) activeIndex = index; });
    links.forEach((link, index) => link.classList.toggle("is-active", index === activeIndex));
  }

  function prepareMarkdownImages(body) { body.querySelectorAll("img").forEach((image) => { const source = image.getAttribute("src")?.trim(); if (!source) return; if (source.startsWith("//")) image.src = `https:${source}`; else if (/^(?:\.\/)?uploads\//i.test(source)) image.src = source.replace(/^\.\//, "assets/"); image.loading = "lazy"; image.decoding = "async"; image.referrerPolicy = "no-referrer"; image.addEventListener("error", () => image.classList.add("is-broken"), { once: true }); }); }
  function renderPageMarkdown(page) {
    const body = $("[data-page-markdown]");
    if (!body) return;
    body.innerHTML = pageMarkdown(page);
    prepareMarkdownImages(body);
    normalizeMarkdownLinks(body);
    renderEmbeddedTools(body, page);
    buildPageOutline(body);
    updatePageOutlineActive();
    enhanceMarkdown(body);
    if (window.lucide) window.lucide.createIcons();
  }

  function closePageOutline() { const panel = $("[data-page-outline-panel]"); const toggle = $("[data-page-outline-header-toggle]"); if (!panel || !toggle) return; if (panel.contains(document.activeElement)) toggle.focus(); const mobile = window.matchMedia("(max-width: 986px)").matches; panel.classList.remove("is-open"); panel.setAttribute("aria-hidden", String(mobile)); panel.inert = mobile; toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "打开文章大纲"); }

  function closeFilterMenu() { const menu = $("[data-directory-category-menu]"); if (!menu || !menu.classList.contains("is-open")) return; menu.classList.remove("is-open"); menu.setAttribute("hidden", ""); menu.parentElement?.querySelector("[data-directory-category-trigger]")?.setAttribute("aria-expanded", "false"); }

  function togglePageOutline(open = null) { const panel = $("[data-page-outline-panel]"); const toggle = $("[data-page-outline-header-toggle]"); if (!panel || !toggle) return; const next = open == null ? !panel.classList.contains("is-open") : open; if (next) { panel.inert = false; panel.setAttribute("aria-hidden", "false"); } panel.classList.toggle("is-open", next); toggle.setAttribute("aria-expanded", String(next)); toggle.setAttribute("aria-label", next ? "关闭文章大纲" : "打开文章大纲"); if (next) panel.querySelector("a")?.focus(); else closePageOutline(); }

  function renderSubpage({ animate = true } = {}) {
    const directory = $("[data-page-directory]");
    const view = $("[data-subpage-view]");
    const params = new URLSearchParams(location.search);
    const homeSections = $("main") ? $$("main > section") : [];
    if (params.get("view") === "pages") {
      homeSections.forEach((section) => { section.hidden = true; });
      if (view) view.hidden = true;
      document.body.classList.remove("is-subpage");
      document.body.classList.add("is-directory");
      if (animate) playPageInstanceTransition(directory);
      renderPageDirectory({ animate: false });
      return null;
    }
    if (directory) { directory.hidden = true; directory.innerHTML = ""; }
    document.body.classList.remove("is-directory");
    const page = viewedPage();
    let directoryBackUrl = pageDirectoryUrl(1);
    const returnUrl = params.get("from");
    if (returnUrl) {
      try {
        const candidate = new URL(returnUrl, location.href);
        if (candidate.origin === location.origin && candidate.pathname === location.pathname && candidate.searchParams.get("view") === "pages") directoryBackUrl = `${candidate.pathname}${candidate.search}${candidate.hash}`;
      } catch {}
    }
    const outlineHeaderToggle = $("[data-page-outline-header-toggle]");
    if (outlineHeaderToggle) outlineHeaderToggle.hidden = !viewPageId || !page;
    document.body.classList.toggle("is-subpage", Boolean(viewPageId));
    if (!viewPageId) {
      homeSections.forEach((section) => { section.hidden = false; });
      view.hidden = true;
      view.innerHTML = "";
      return null;
    }
    homeSections.forEach((section) => { section.hidden = true; });
    view.hidden = false;
    if (animate) playPageInstanceTransition(view);
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
        <img class="subpage-hero-media is-loaded" src="${escapeHTML(page.heroImage)}" alt="" decoding="async" fetchpriority="high" data-page-image-display="heroImage" />
        <div class="subpage-hero-overlay" aria-hidden="true"></div>
        <a class="subpage-back" href="${directoryBackUrl}"><span aria-hidden="true">←</span> 织影落花集</a>
        <p class="subpage-eyebrow" data-page-field-display="eyebrow">${escapeHTML(page.eyebrow)}</p>
        <h1 class="subpage-heading" data-page-field-display="title">${title}</h1>
        <p class="subpage-summary" data-page-field-display="summary">${escapeHTML(page.summary)}</p>
      </section>
      <section class="subpage-content section-light" id="page-content">
        <div class="section-tag"><span>01</span><p>${escapeHTML(page.navLabel)}</p></div>
        <div class="subpage-copy">
          <h2 data-page-field-display="contentTitle">${escapeHTML(page.contentTitle)}</h2>
          <div class="markdown-body" data-page-field-display="body" data-page-markdown></div>
          <div class="subpage-actions"><a class="inline-cta dark" href="${escapeHTML(page.ctaUrl || "#")}" data-page-cta data-page-field-display="ctaLabel">${escapeHTML(page.ctaLabel)} <span class="double-arrow" data-element-key="page:${escapeHTML(page.id)}:content:cta-arrow" aria-hidden="true"><i data-lucide="arrow-right"></i><i data-lucide="arrow-right"></i></span></a></div>
        </div>
        <aside class="page-outline-panel" data-page-outline-panel aria-label="文章大纲" aria-hidden="true"><div class="outline-header"><span>文章大纲</span><button class="icon-button outline-close" type="button" data-page-outline-close aria-label="关闭大纲"><i data-lucide="x"></i></button></div><nav data-page-outline></nav></aside>
      </section>
      <section class="subpage-next section-dark${next ? "" : " is-home-return"}" id="page-next">
        <p>继续探索</p>
        ${next ? `<a href="${pageUrl(next.slug, params.get("from") || "")}"><span class="subpage-next-meta">${escapeHTML(next.eyebrow)}</span><strong>${escapeHTML(next.title).replace(/\n/g, " ")}</strong><span class="double-arrow subpage-next-arrow" data-element-key="page:${escapeHTML(page.id)}:next:arrow" aria-hidden="true"><i data-lucide="arrow-right"></i><i data-lucide="arrow-right"></i></span></a>` : `<a href="${homeUrl("#download")}" data-home-link="#download"><span class="subpage-next-meta">织影落花</span><strong>返回首页继续探索</strong><span class="double-arrow subpage-next-arrow" data-element-key="page:${escapeHTML(page.id)}:next:arrow" aria-hidden="true"><i data-lucide="arrow-right"></i><i data-lucide="arrow-right"></i></span></a>`}
      </section>`;
    renderPageMarkdown(page);
    closePageOutline();
    if (window.lucide) window.lucide.createIcons();
    revealHeroMedia($(".subpage-hero-media", view));
    document.title = `${page.title.replace(/\n/g, " ")} — ${state.brand}`;
    return page;
  }

  function renderNews() {
    const rail = $(".news-rail");
    rail.innerHTML = state.news.map((item, index) => `<article class="news-card reveal-card" data-news-index="${index}"><div class="news-card-image"><img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" /><div class="news-card-content"><div class="news-meta"><p>${item.tag}</p><p><span>${String(index + 1).padStart(2, "0")}</span>/16 · ${item.date}</p></div><h3>${item.title}</h3><p>${item.body}</p><a href="#download" class="card-cta">查看更新 <span class="double-arrow"><i data-lucide="arrow-right"></i><i data-lucide="arrow-right"></i></span></a></div></div></article>`).join("");
    rail.querySelectorAll(".news-card").forEach((card, index) => { card.addEventListener("mouseenter", () => setActiveNews(index)); card.addEventListener("focusin", () => setActiveNews(index)); });
    if (window.lucide) window.lucide.createIcons();
    observeReveals();
  }

  function renderExpertise() {
    const list = $(".expertise-list");
    list.innerHTML = state.expertise.map((item, index) => { const targetPage = state.pages.find((page) => page.id === state.homeLinks[`expertise:${index}:arrow`]); const targetHref = targetPage ? pageUrl(targetPage.slug) : "#"; return `<article class="expertise-item reveal-card" data-expertise-index="${index}"><div class="expertise-number">${String(index + 1).padStart(2, "0")}</div><div><h3>${item.title}</h3><p>${item.caption}</p></div><div class="expertise-thumb"><img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" /></div><a class="item-arrow" href="${escapeHTML(targetHref)}" aria-label="打开 ${escapeHTML(item.title)}"><i data-lucide="arrow-up-right"></i></a></article>`; }).join("");
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
    "[data-element-key]",
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
      if (item.type === "image") { element.src = item.src || seedImages[0]; element.alt = item.text || "自定义图片"; element.loading = "lazy"; element.decoding = "async"; }
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

  function isMarkdownChild(element) { return Boolean(element.closest(".markdown-body") && !element.matches(".markdown-body")); }

  function refreshElementRegistry() {
    elementRegistry = new Map();
    $$(elementSelectors).forEach((element) => {
      if (isMarkdownChild(element) || element.closest(".editor, .search-layer, .menu-layer, .page-loader") || element.closest("[hidden]")) return;
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
    element.style.overflowY = style.height && !element.matches(".section-tag") ? "auto" : "";
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
    const entries = [...elementRegistry.entries()].filter(([, element]) => (!scope || elementScope(element) === scope) && (!query || elementLabel(element).toLowerCase().includes(query) || element.dataset.elementId.toLowerCase().includes(query)));
    const entryMap = new Map(entries);
    const elementKeys = new Map([...elementRegistry.entries()].map(([key, element]) => [element, key]));
    const children = new Map();
    const roots = [];
    entries.forEach(([key, element]) => {
      let parent = element.parentElement;
      while (parent && !elementKeys.has(parent)) parent = parent.parentElement;
      const parentKey = parent ? elementKeys.get(parent) : null;
      if (parentKey && entryMap.has(parentKey)) {
        if (!children.has(parentKey)) children.set(parentKey, []);
        children.get(parentKey).push(key);
      } else roots.push(key);
    });
    list.textContent = "";
    let index = 0;
    const appendNode = (key, depth) => {
      const element = entryMap.get(key); if (!element) return;
      const hasChildren = Boolean(children.get(key)?.length);
      const collapsed = collapsedElementIds.has(key);
      const node = document.createElement("div"); node.className = "element-tree-node"; node.style.setProperty("--element-depth", depth); node.setAttribute("role", "treeitem"); node.setAttribute("aria-level", String(depth + 1));
      const toggle = document.createElement("button"); toggle.type = "button"; toggle.className = "element-tree-toggle"; toggle.dataset.elementToggle = key; toggle.disabled = !hasChildren; toggle.setAttribute("aria-label", `${collapsed ? "展开" : "折叠"} ${elementLabel(element)}`); if (hasChildren) { node.setAttribute("aria-expanded", String(!collapsed)); toggle.innerHTML = `<i data-lucide="${collapsed ? "chevron-right" : "chevron-down"}"></i>`; }
      const button = document.createElement("button"); button.type = "button"; button.className = `element-list-item${key === selectedElementKey ? " is-selected" : ""}${state.elementStyles[key]?.deleted ? " is-deleted" : ""}`; button.dataset.elementSelect = key; button.setAttribute("role", "option"); button.setAttribute("aria-selected", String(key === selectedElementKey));
      const number = document.createElement("b"); number.className = "element-list-number"; number.textContent = String(++index).padStart(2, "0"); const tag = document.createElement("small"); tag.textContent = elementScope(element); const label = document.createElement("span"); label.textContent = elementLabel(element); button.append(number, tag, label); node.append(toggle, button); list.append(node);
      if (hasChildren && !collapsed) children.get(key).forEach((childKey) => appendNode(childKey, depth + 1));
    };
    roots.forEach((key) => appendNode(key, 0));
    if (window.lucide) window.lucide.createIcons();
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

  function render({ sync = true, animate = true } = {}) {
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
    document.documentElement.style.setProperty("--header-top-alpha", Number(state.headerTopOpacity ?? 0) / 100);
    document.documentElement.style.setProperty("--header-scrolled-alpha", Number(state.headerScrolledOpacity ?? 84) / 100);
    document.documentElement.style.setProperty("--header-blur", `${Number(state.headerBlur ?? 14)}px`);
    document.documentElement.style.setProperty("--header-border-alpha", Number(state.headerBorder ?? 0) / 100);
    $(".site-header").classList.toggle("uses-dark-scroll-header", state.headerLightOnScroll === false);
    $(".editor").style.opacity = Math.max(.35, Math.min(1, Number(state.editorOpacity ?? 96) / 100));
    document.title = `${state.brand} — Minecraft Mod`;
    renderPageNavigation(); renderSubpage({ animate }); renderNews(); renderExpertise(); renderCustomElements(); syncElementScopes();
    refreshElementRegistry();
    applyHomePageLinks();
    if (sync) syncControls();
    updateWordWave(); updateHistoryButtons();
  }

  function syncControls() {
    $$('[data-setting]').forEach((input) => { if (document.activeElement !== input) { if (input.type === "checkbox") input.checked = Boolean(state[input.dataset.setting]); else input.value = state[input.dataset.setting] ?? ""; } });
    $("[data-color-output]").textContent = state.accent.toUpperCase();
    $$('[data-range-output]').forEach((output) => { output.textContent = `${state[output.dataset.rangeOutput]}${output.dataset.rangeUnit ?? "%"}`; });
    $$('[data-collection-select]').forEach((select) => {
      const type = select.dataset.collectionSelect; const collection = state[type]; select.innerHTML = collection.map((item, index) => `<option value="${index}">${String(index + 1).padStart(2, "0")} · ${item.title}</option>`).join(""); select.value = activeCollection[type];
    });
    syncCollectionControls("news"); syncCollectionControls("expertise");
    syncPageControls();
  }

  function pageTreeRows() {
    return state.pages.map((page) => ({ page, depth: 0, hasChildren: false }));
  }

  function renderPageList() {
    const list = $("[data-page-list]"); if (!list) return;
    list.innerHTML = pageTreeRows().map(({ page }) => {
      const index = state.pages.indexOf(page);
      return `<div class="page-tree-node" role="treeitem" aria-level="1"><button type="button" class="page-tree-toggle" aria-hidden="true" tabindex="-1"></button><button type="button" class="page-list-item${page.id === activePageId ? " is-selected" : ""}" data-page-select="${escapeHTML(page.id)}" role="option" aria-selected="${page.id === activePageId}"><b>${String(index + 1).padStart(2, "0")}</b><span><strong>${escapeHTML(page.navLabel || page.title)}</strong><small>/${escapeHTML(page.slug)}${page.published ? " · 已发布" : " · 草稿"}${(page.tags || []).length ? ` · ${(page.tags || []).map(escapeHTML).join(" · ")}` : ""}</small></span></button></div>`;
    }).join("");
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

  function isPageDescendant(pageId, ancestorId) {
    const visited = new Set();
    let page = state.pages.find((item) => item.id === pageId);
    while (page?.parentId) {
      if (visited.has(page.id)) return false;
      visited.add(page.id);
      if (page.parentId === ancestorId) return true;
      page = state.pages.find((item) => item.id === page.parentId);
    }
    return false;
  }

  function syncPageParentOptions(page) {
    const select = $("[data-page-field=parentId]");
    if (!select) return;
    const current = page.parentId || "";
    select.innerHTML = `<option value="">根页面</option>${state.pages.filter((candidate) => candidate.id !== page.id && !isPageDescendant(candidate.id, page.id)).map((candidate) => `<option value="${escapeHTML(candidate.id)}">${escapeHTML(candidate.navLabel || candidate.title)}</option>`).join("")}`;
    select.value = state.pages.some((candidate) => candidate.id === current && candidate.id !== page.id && !isPageDescendant(candidate.id, page.id)) ? current : "";
  }

  function syncPageControls() {
    if (activePageId && !state.pages.some((page) => page.id === activePageId)) activePageId = state.pages[0]?.id || null;
    const page = selectedPage();
    renderPageList();
    const inspector = $("[data-page-inspector]"); if (!inspector) return;
    inspector.hidden = !page;
    if (!page) { renderHomeLinkControls(null); return; }
    $$('[data-page-field]', inspector).forEach((input) => { if (document.activeElement === input) return; if (input.type === "checkbox") input.checked = Boolean(page[input.dataset.pageField]); else input.value = page[input.dataset.pageField] ?? ""; });
    const midiStatus = $(`[data-page-midi-status]`); if (midiStatus) midiStatus.textContent = page.midiName ? `当前文件：${page.midiName}` : "尚未上传 MIDI 文件";
    const midiRemove = $(".midi-remove-button"); if (midiRemove) midiRemove.disabled = !page.midiData;
    $$('[data-page-tag]', inspector).forEach((input) => { if (document.activeElement !== input) input.value = page.tags?.[Number(input.dataset.pageTag)] || ""; });
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
  function applySetting(input) { state[input.dataset.setting] = input.type === "checkbox" ? input.checked : input.value; render({ sync: false }); syncControls(); saveState(); }

  $$('[data-setting]').forEach((input) => { input.addEventListener("focus", () => { interactionStart = clone(state); }); input.addEventListener("input", () => applySetting(input)); input.addEventListener("change", () => { remember(interactionStart); interactionStart = null; }); });
  $$('[data-collection-select]').forEach((select) => select.addEventListener("change", () => { activeCollection[select.dataset.collectionSelect] = Number(select.value); syncControls(); }));
  $$('[data-collection]').forEach((input) => { input.addEventListener("focus", () => { interactionStart = clone(state); }); input.addEventListener("input", () => { state[input.dataset.collection][activeCollection[input.dataset.collection]][input.dataset.field] = input.value; render({ sync: false }); saveState(); }); input.addEventListener("change", () => { remember(interactionStart); interactionStart = null; }); });

  $("[data-page-list]")?.addEventListener("click", (event) => { const toggle = event.target.closest("[data-page-toggle]"); if (toggle) { const pageId = toggle.dataset.pageToggle; if (collapsedPageIds.has(pageId)) collapsedPageIds.delete(pageId); else collapsedPageIds.add(pageId); renderPageList(); return; } const button = event.target.closest("[data-page-select]"); if (!button) return; previewPage(button.dataset.pageSelect); });
  $$('[data-page-field], [data-page-tag]').forEach((input) => {
    input.addEventListener("focus", () => { interactionStart = clone(state); });
    input.addEventListener("input", () => {
      const page = selectedPage();
      if (!page) return;
      if (input.dataset.pageTag != null) {
        const tags = [...(page.tags || [])];
        tags[Number(input.dataset.pageTag)] = input.value.trim();
        page.tags = normalizePageTags(tags);
      } else {
        const field = input.dataset.pageField;
        page[field] = input.type === "checkbox" ? input.checked : input.value;
      }
      render({ sync: false }); renderPageList(); saveState();
    });
    input.addEventListener("change", () => { const page = selectedPage(); if (page && input.dataset.pageField === "slug") { page.slug = uniqueSlug(input.value, page.id); input.value = page.slug; if (viewPageId === page.id) history.replaceState(null, "", pageUrl(page.slug)); render({ sync: false }); renderPageList(); saveState(); } remember(interactionStart); interactionStart = null; });
  });
  function markdownFileName(page) { const base = String(page.slug || page.title || "page").replace(/[\\/:*?"<>|\x00-\x1f]/g, "-").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "page"; return `${base}.md`; }
  $(`[data-page-midi]`)?.addEventListener("change", async (event) => {
    const input = event.target; const file = input.files?.[0]; const page = selectedPage();
    if (!file || !page) return;
    if (file.size > 2 * 1024 * 1024) { showToast("MIDI 文件不能超过 2 MB"); input.value = ""; return; }
    try {
      const previous = clone(state); const reader = new FileReader();
      const data = await new Promise((resolve, reject) => { reader.onerror = reject; reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); });
      midiToAbc(dataUrlToMidiBytes(data), file.name);
      page.midiData = data; page.midiName = file.name; remember(previous); render({ sync: false }); syncPageControls(); saveState(); showToast(`已加载五线谱：${file.name}`);
    } catch { showToast("MIDI 文件读取或解析失败"); }
    input.value = "";
  });
  $(".midi-remove-button")?.addEventListener("click", () => { const page = selectedPage(); if (!page?.midiData) return; const previous = clone(state); page.midiData = ""; page.midiName = ""; remember(previous); render({ sync: false }); syncPageControls(); saveState(); showToast("已移除 MIDI 五线谱"); });
  $("[data-page-markdown-import]")?.addEventListener("change", async (event) => {
    const input = event.target;
    const file = input.files?.[0];
    const page = selectedPage();
    if (!file || !page) return;
    try {
      const previous = clone(state);
      const body = await file.text();
      const markdown = body.replace(/^\uFEFF/, "");
      if (markdown.length > 300000) { showToast("Markdown 文件不能超过 300000 字"); return; }
      page.body = markdown;
      remember(previous);
      render({ sync: false });
      syncPageControls();
      saveState();
      showToast(`已导入 Markdown：${file.name}`);
    } catch { showToast("Markdown 文件读取失败"); }
    input.value = "";
  });
  $(".page-add")?.addEventListener("click", () => { const previous = clone(state); const id = `page-${Date.now().toString(36)}`; const page = { ...clone(defaults.pages[0]), id, parentId: null, tags: ["未分类"], slug: uniqueSlug("new-page"), navLabel: "新文章", eyebrow: "", title: "新的文章", summary: "在这里填写文章摘要。", contentTitle: "正文标题", body: "在这里填写完整正文。", published: true }; state.pages.push(page); remember(previous); previewPage(id); saveState(); showToast("已新增文章"); });
  $(".page-duplicate")?.addEventListener("click", () => { const source = selectedPage(); if (!source) return; const previous = clone(state); const copy = { ...clone(source), id: `page-${Date.now().toString(36)}`, parentId: null, tags: [...(source.tags || [])], slug: uniqueSlug(`${source.slug}-copy`), navLabel: `${source.navLabel}副本`, published: false }; state.pages.push(copy); remember(previous); previewPage(copy.id); saveState(); showToast("已复制为草稿"); });
  $(".page-delete")?.addEventListener("click", () => { const page = selectedPage(); if (!page) return; const previous = clone(state); const customIds = state.customElements.filter((item) => item.pageId === page.id).map((item) => item.id); collapsedPageIds.delete(page.id); state.customElements = state.customElements.filter((item) => item.pageId !== page.id); state.homeLinks = Object.fromEntries(Object.entries(state.homeLinks).filter(([, pageId]) => pageId !== page.id)); Object.keys(state.elementStyles).filter((key) => key.startsWith(`page:${page.id}:`) || customIds.some((id) => key === `custom:${id}`)).forEach((key) => delete state.elementStyles[key]); if (viewPageId === page.id) { viewPageId = null; history.replaceState(null, "", location.pathname); } activePageId = state.pages[0]?.id || null; remember(previous); render(); saveState(); showToast("页面已删除，子页面已提升，可撤销"); });
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
    const toggle = event.target.closest("[data-element-toggle]");
    if (toggle) { const key = toggle.dataset.elementToggle; if (collapsedElementIds.has(key)) collapsedElementIds.delete(key); else collapsedElementIds.add(key); renderElementList(); return; }
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

  function toggleEditor(open) { document.body.classList.toggle("editor-open", open); try { sessionStorage.setItem(EDITOR_SESSION_KEY, open ? "1" : "0"); } catch {} const page = selectedPage(); const pageOpen = $(".page-open"); if (page && pageOpen) pageOpen.href = pageUrl(page.slug); if (!open) setPickerMode(false); $(".editor").setAttribute("aria-hidden", String(!open)); $(".edit-button").setAttribute("aria-expanded", String(open)); if (open) setTimeout(() => $(".editor-close").focus(), 280); else $(".edit-button").focus(); }
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
    if (!target) return;
    const page = state.pages.find((item) => item.id === target.dataset.homePageLink);
    if (!page) return;
    event.preventDefault();
    previewPage(page.id);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeFilterMenu(); return; }
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
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-directory-category-trigger], [data-directory-category-menu]")) closeFilterMenu();
    const filterTrigger = event.target.closest("[data-directory-category-trigger]");
    if (filterTrigger) {
      event.preventDefault();
      const menu = filterTrigger.parentElement.querySelector("[data-directory-category-menu]");
      if (menu && menu.classList.contains("is-open")) {
        closeFilterMenu();
      } else if (menu) {
        menu.removeAttribute("hidden");
        requestAnimationFrame(() => menu.classList.add("is-open"));
        filterTrigger.setAttribute("aria-expanded", "true");
      }
      return;
    }
    const filterOption = event.target.closest("[data-directory-category-menu] [data-category-value]");
    if (filterOption) {
      event.preventDefault();
      const value = filterOption.dataset.categoryValue || "";
      const currentParams = new URLSearchParams(location.search);
      if (value !== (currentParams.get("tag") || "")) {
        const url = new URL(pageDirectoryUrl(1, value, currentParams.get("q") || ""), location.href);
        history.pushState(null, "", `${url.pathname}${url.search}`);
        render({ animate: false });
      } else {
        closeFilterMenu();
      }
      return;
    }
    const filterClose = event.target.closest("[data-directory-category-close]");
    if (filterClose) { event.preventDefault(); closeFilterMenu(); return; }
    const midiAll = event.target.closest("[data-midi-render-all]");
    if (midiAll) {
      const figures = $$(".markdown-midi");
      const figure = figures[Number(midiAll.dataset.midiRenderAll)];
      const render = midiAll.getAttribute("aria-pressed") !== "true";
      setAllMidiStaffs(figure, render);
      midiAll.setAttribute("aria-pressed", String(render));
      midiAll.querySelector(".outline-midi-symbol").textContent = render ? "−" : "+";
      return;
    }
    const staffTrigger = event.target.closest(".midi-staff-trigger");
    if (staffTrigger) {
      const staff = staffTrigger.closest(".midi-staff");
      if (!staff) return;
      if (staff.dataset.rendered === "true") collapseMidiStaff(staff);
      else if (staff.dataset.rendered !== "error") {
        renderMidiStaff(staff);
        staff.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (event.target.closest("[data-page-outline-toggle]")) { togglePageOutline(); return; }
    if (event.target.closest("[data-page-outline-close]")) { closePageOutline(); return; }
    const outlineLink = event.target.closest("[data-page-outline] a");
    if (outlineLink) {
      event.preventDefault();
      const linkTarget = document.getElementById(outlineLink.getAttribute("href")?.slice(1));
      closePageOutline();
      if (linkTarget) requestAnimationFrame(() => linkTarget.scrollIntoView({ behavior: "smooth", block: "start" }));
      return;
    }

    const directoryLink = event.target.closest('a[href*="view=pages"]');
    if (directoryLink) {
      const url = new URL(directoryLink.href, location.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.searchParams.get("view") === "pages") {
        const isSubpageBack = !!event.target.closest(".subpage-back");
        const inDirectory = !!event.target.closest("[data-page-directory]");
        event.preventDefault();
        history.pushState(null, "", `${url.pathname}${url.search}`);
        render({ animate: false });
        if (isSubpageBack || inDirectory) {
          scrollDirectoryToHeroBottom();
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
        return;
      }
    }
    const link = event.target.closest('a[href*="?page="]');
    if (!link || link.target === "_blank") return;
    const pageLink = sitePageFromUrl(link.href);
    if (!pageLink) return;
    event.preventDefault();
    $(".search-layer").classList.remove("is-open");
    $(".search-layer").setAttribute("aria-hidden", "true");
    history.pushState(null, "", pageUrl(pageLink.slug));
    previewPageFromUrl(new URL(location.href));
  });
  window.addEventListener("popstate", () => {
    const url = new URL(location.href);
    if (url.searchParams.get("view") === "pages") {
      render({ animate: false });
    } else {
      previewPageFromUrl(url);
    }
  });
  function trailerEmbedUrl(value) {
    const source = String(value || "").trim();
    const iframeMatch = source.match(/<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
    const candidate = iframeMatch ? iframeMatch[1] : source;
    try {
      const url = new URL(candidate.startsWith("//") ? `https:${candidate}` : candidate, location.href);
      if (url.hostname === "player.bilibili.com" && url.pathname === "/player.html") return url.href;
    } catch { /* Fall through to the normal video URL path. */ }
    return "";
  }

  $(".watch-button")?.addEventListener("click", () => {
    const trailerVideo = state.trailerVideo;
    if (!trailerVideo) { showToast("预告片将在下一版本上线"); return; }
    const layer = $(".trailer-layer"); if (!layer) return;
    const video = layer.querySelector("video");
    const frame = layer.querySelector("iframe");
    const embedUrl = trailerEmbedUrl(trailerVideo);
    if (embedUrl) {
      video.pause(); video.removeAttribute("src"); video.load(); video.hidden = true;
      frame.src = embedUrl; frame.hidden = false;
    } else {
      frame.removeAttribute("src"); frame.hidden = true;
      video.hidden = false; video.src = trailerVideo; video.play().catch(() => {});
    }
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
  });
  function closeTrailer() {
    const layer = $(".trailer-layer"); if (!layer) return;
    const video = layer.querySelector("video"); const frame = layer.querySelector("iframe");
    video.pause(); video.removeAttribute("src"); video.load(); frame.removeAttribute("src"); frame.hidden = true; video.hidden = false;
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
  }
  $(".trailer-close")?.addEventListener("click", closeTrailer);
  $(".trailer-layer")?.addEventListener("click", (event) => { if (event.target === event.currentTarget) closeTrailer(); });
  function normalizeSearchText(value) { return String(value || "").normalize("NFKC").toLocaleLowerCase(); }
  function searchPageText(page) { return [page.title, page.summary, page.body].filter(Boolean).join(" "); }
  function searchExcerpt(sourceValue, query) { const source = String(sourceValue || "").normalize("NFKC").replace(/[#>*_`~\[\]()!-]/g, " ").replace(/\s+/g, " ").trim(); const normalizedQuery = normalizeSearchText(query); const index = source.toLocaleLowerCase().indexOf(normalizedQuery); if (index < 0) return source.slice(0, 120); return `${index > 36 ? "..." : ""}${source.slice(Math.max(0, index - 36), index + 96)}${source.length > index + 96 ? "..." : ""}`; }
  function searchMarkdownExcerpt(page, query) { return searchExcerpt(page.body || page.summary, query); }
  function renderSearchResults(query) { const status = $(".search-result"); const results = $(".search-results"); if (!status || !results) return; if (!query) { status.textContent = "请输入关键词"; results.innerHTML = ""; return; } const normalizedQuery = normalizeSearchText(query).trim(); const hits = state.pages.filter((page) => normalizeSearchText(searchPageText(page)).includes(normalizedQuery)); status.textContent = hits.length ? `找到 ${hits.length} 个子页` : "没有找到相关子页"; results.innerHTML = hits.map((page) => `<article class="search-result-item" role="listitem"><p class="search-result-eyebrow">子页 · ${escapeHTML(page.eyebrow || page.navLabel || "Markdown")}</p><h2>${escapeHTML(String(page.title || "未命名页面").replace(/\n/g, " "))}</h2><p class="search-result-summary">${escapeHTML(page.summary || "暂无简述")}</p><p class="search-result-markdown"><span>Markdown</span> ${escapeHTML(searchMarkdownExcerpt(page, query))}</p><a href="${pageUrl(page.slug)}" class="search-result-link">进入子页 <i data-lucide="arrow-up-right"></i></a></article>`).join(""); if (window.lucide) window.lucide.createIcons(); }
  $(".search-button")?.addEventListener("click", () => { if (new URLSearchParams(location.search).get("view") === "pages" && document.body.classList.contains("is-directory")) { scrollDirectoryToHeroBottom(); $("[data-directory-search]")?.focus(); return; } $(".search-layer").classList.add("is-open"); $(".search-layer").setAttribute("aria-hidden", "false"); setTimeout(() => $("#site-search").focus(), 200); }); $(".search-close")?.addEventListener("click", () => { $(".search-layer").classList.remove("is-open"); $(".search-layer").setAttribute("aria-hidden", "true"); }); $(".search-form")?.addEventListener("submit", (event) => { event.preventDefault(); renderSearchResults($("#site-search").value.trim().toLowerCase()); }); $("#site-search")?.addEventListener("input", (event) => renderSearchResults(event.target.value.trim().toLowerCase()));
  $(".menu-button")?.addEventListener("click", () => { $(".menu-layer").classList.add("is-open"); $(".menu-layer").setAttribute("aria-hidden", "false"); }); $(".menu-close")?.addEventListener("click", () => { $(".menu-layer").classList.remove("is-open"); $(".menu-layer").setAttribute("aria-hidden", "true"); }); $(".menu-layer")?.addEventListener("click", (event) => { if (event.target.closest("a")) { $(".menu-layer").classList.remove("is-open"); $(".menu-layer").setAttribute("aria-hidden", "true"); } });
  $(".download-button")?.addEventListener("click", (event) => { if (!state.downloadUrl || state.downloadUrl === "#") { event.preventDefault(); showToast("请在编辑器中填写下载链接"); } });

  function revealInViewport() { $$(".reveal, .reveal-card, .media-reveal").forEach((element) => { const rect = element.getBoundingClientRect(); if (rect.top < window.innerHeight * .94 && rect.bottom > -40) element.classList.add("is-visible"); }); }
  let colorFrame; window.addEventListener("scroll", () => { const y = window.scrollY; $(".site-header").classList.toggle("is-scrolled", y > 40); const subpageHero = document.querySelector(".subpage-hero"); const subpageBack = document.querySelector(".subpage-back"); if (subpageHero && subpageBack) subpageBack.classList.toggle("subpage-back-scrolled", y > subpageHero.offsetHeight - 150); const max = document.documentElement.scrollHeight - window.innerHeight; $(".scroll-progress span").style.width = `${max ? y / max * 100 : 0}%`; document.documentElement.style.setProperty("--hero-shift", `${Math.min(y * .04, 32)}px`); revealInViewport(); updatePageOutlineActive(); if (!colorFrame) colorFrame = requestAnimationFrame(() => { colorFrame = null; updateWordWave(); }); }, { passive: true }); window.addEventListener("resize", () => { revealInViewport(); updateWordWave(); }, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { if ($(".trailer-layer").classList.contains("is-open")) closeTrailer(); else if ($(".menu-layer").classList.contains("is-open")) $(".menu-close").click(); else if ($(".search-layer").classList.contains("is-open")) $(".search-close").click(); else if ($("[data-page-outline-panel].is-open")) closePageOutline(); else if (document.body.classList.contains("editor-open")) toggleEditor(false); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && document.body.classList.contains("editor-open")) { event.preventDefault(); (event.shiftKey ? $(".redo-button") : $(".undo-button")).click(); }
  });

  function observeReveals() { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .08 }); $$(".reveal, .reveal-card, .media-reveal").forEach((element) => observer.observe(element)); }
  async function bootstrap() {
    if (window.mermaid) window.mermaid.initialize({ startOnLoad: false, theme: "base", securityLevel: "strict", themeVariables: { primaryColor: "#eef0e8", primaryTextColor: "#30332e", primaryBorderColor: "#62665f", lineColor: "#62665f", tertiaryColor: "#f5f4ed" } });
    syncViewedPageFromLocation();
    render();
    const loadedBundledConfig = await loadBundledConfig();
    if (loadedBundledConfig) {
      syncViewedPageFromLocation();
      render();
    }
    revealHeroMedia($(".hero-media"));
    if (window.lucide) window.lucide.createIcons();
    syncElementScopes();
    render(); observeReveals(); revealInViewport();
    migrateEmbeddedImages();
    syncConfigMetaDisplay();
    if (isLocalDev) document.body.classList.add("is-dev");
    if (isLocalDev) { const editButton = $( ".edit-button" ); if (editButton) editButton.style.display = "inline-flex"; }
    document.body.classList.add("page-ready");
    try { sessionStorage.setItem("ashfall-loader-seen", "1"); } catch {}
    const params = new URLSearchParams(location.search); if (params.get("edit") === "1" || editorKeepOpen) { $(".edit-button").style.display = ""; toggleEditor(true); } if (viewPageId && viewPageId !== "missing") $$(".editor-tabs button").find((button) => button.dataset.tab === "pages")?.click(); if (["manifesto", "news", "expertise", "about", "research", "sustainability", "download"].includes(params.get("view"))) setTimeout(() => { document.getElementById(params.get("view"))?.scrollIntoView(); revealInViewport(); }, 60);
  }
  bootstrap();
  window.openAshfallEditor = () => { $(".edit-button").style.display = ""; toggleEditor(true); };
  window.closeAshfallEditor = () => toggleEditor(false);
})();
