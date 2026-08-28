(() => {
  "use strict";

  const STORAGE_KEY = "ashfall-home-config-v2";
  const MAX_HISTORY = 40;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const seedImages = ["assets/feature-ecology.png", "assets/feature-machinery.png", "assets/feature-weather.png", "assets/news-cavern.png", "assets/about-team.png", "assets/research-lab.png", "assets/sustainability-world.png"];

  const defaults = {
    configVersion: 3,
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
    Object.values(merged.elementStyles).forEach((style) => {
      if (!style || style.positionMode) return;
      if (style.x != null || style.y != null || style.zIndex != null) style.positionMode = "free";
    });
    if (Number(input.configVersion || 0) < 3) {
      merged.heroLine1 = defaults.heroLine1;
      merged.heroLine2 = defaults.heroLine2;
      merged.heroLine3 = defaults.heroLine3;
      merged.configVersion = defaults.configVersion;
    }
    merged.news = defaults.news.map((item, index) => ({ ...item, ...(Array.isArray(input.news) ? input.news[index] : {}) }));
    merged.expertise = defaults.expertise.map((item, index) => ({ ...item, ...(Array.isArray(input.expertise) ? input.expertise[index] : {}) }));
    return merged;
  }

  let state;
  try { state = mergeConfig(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {}); } catch { state = clone(defaults); }
  let past = [];
  let future = [];
  let interactionStart = null;
  let activeCollection = { news: 0, expertise: 0 };
  let saveTimer;
  let toastTimer;
  let selectedElementKey = null;
  let elementRegistry = new Map();
  let pickerMode = false;

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
  ].join(", ");

  function elementScope(element) {
    const section = element.closest("section, header, footer");
    return section?.id || section?.className?.split(" ")[0] || "page";
  }

  function sectionOptions() {
    return [...document.querySelectorAll("main > section")].map((section) => ({
      value: section.id || section.className.split(" ")[0],
      label: section.id || section.className.split(" ")[0],
    }));
  }

  function renderCustomElements() {
    $$("[data-custom-element]").forEach((element) => element.remove());
    state.customElements.forEach((item) => {
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
    if (element.dataset.newsIndex != null) return `新闻 ${String(Number(element.dataset.newsIndex) + 1).padStart(2, "0")}`;
    if (element.dataset.expertiseIndex != null) return `系统 ${String(Number(element.dataset.expertiseIndex) + 1).padStart(2, "0")}`;
    const text = String(element.textContent || element.getAttribute("alt") || element.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ");
    return `${element.tagName.toLowerCase()} · ${text.slice(0, 42) || elementScope(element)}`;
  }

  function refreshElementRegistry() {
    elementRegistry = new Map();
    $$(elementSelectors).forEach((element) => {
      if (element.closest(".editor, .search-layer, .menu-layer, .page-loader")) return;
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
    if (style.text && !element.matches("img") && element.children.length === 0 && !element.dataset.bind) element.textContent = style.text;
    if (style.src && element.matches("img")) element.src = style.src;
    if (style.href && element.matches("a")) element.href = style.href;
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
    $("[data-element-name]").textContent = elementLabel(element); const text = $("[data-element-text]"); const textBinding = element.dataset.bind || element.dataset.colorText; text.value = textBinding ? state[textBinding] ?? "" : style.text ?? (element.children.length ? "" : element.textContent.trim()); text.disabled = element.children.length > 0 && !textBinding;
    const href = $("[data-element-href]"); href.value = style.href ?? (element.matches("a") ? element.getAttribute("href") || "" : ""); href.disabled = !element.matches("a");
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
    $$('[data-bind]').forEach((element) => setText(element, state[element.dataset.bind]));
    $$('[data-color-text]').forEach((element) => paintWords(element, state[element.dataset.colorText]));
    $$('[data-bind-href]').forEach((element) => { element.href = state[element.dataset.bindHref] || "#"; });
    $$('[data-image]').forEach((image) => { image.src = state[image.dataset.image]; });
    document.documentElement.style.setProperty("--accent", state.accent);
    document.documentElement.style.setProperty("--hero-shade", Number(state.heroShade) / 100);
    document.documentElement.style.setProperty("--hero-focus", `${state.heroFocus}%`);
    document.documentElement.style.setProperty("--grain-opacity", Number(state.textureGrain) / 100);
    document.documentElement.style.setProperty("--highlight-opacity", Number(state.mediaHighlight) / 100);
    document.documentElement.style.setProperty("--glass-alpha", Number(state.glassOpacity) / 100);
    $(".editor").style.opacity = Math.max(.35, Math.min(1, Number(state.editorOpacity ?? 96) / 100));
    document.title = `${state.brand} — Minecraft Mod`;
    renderNews(); renderExpertise(); renderCustomElements();
    refreshElementRegistry();
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
  }

  function syncCollectionControls(type) {
    const item = state[type][activeCollection[type]]; if (!item) return;
    $$(`[data-collection="${type}"]`).forEach((input) => { if (document.activeElement !== input) input.value = item[input.dataset.field] ?? ""; });
  }

  function saveState() {
    if (!window.localStorage) return;
    const indicator = $(".save-indicator"); indicator.innerHTML = "<i></i> 正在保存...";
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { indicator.innerHTML = "<i></i> 图片过大，未能保存"; return; }
    clearTimeout(saveTimer); saveTimer = setTimeout(() => { indicator.innerHTML = "<i></i> 所有更改已保存"; }, 180);
  }
  window.addEventListener("pagehide", () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} });

  function remember(snapshot) { if (!snapshot || JSON.stringify(snapshot) === JSON.stringify(state)) return; past.push(snapshot); if (past.length > MAX_HISTORY) past.shift(); future = []; updateHistoryButtons(); }
  function updateHistoryButtons() { $(".undo-button").disabled = !past.length; $(".redo-button").disabled = !future.length; $(".undo-button").style.opacity = past.length ? "1" : ".3"; $(".redo-button").style.opacity = future.length ? "1" : ".3"; }
  function applySetting(input) { state[input.dataset.setting] = input.value; render({ sync: false }); syncControls(); saveState(); }

  $$('[data-setting]').forEach((input) => { input.addEventListener("focus", () => { interactionStart = clone(state); }); input.addEventListener("input", () => applySetting(input)); input.addEventListener("change", () => { remember(interactionStart); interactionStart = null; }); });
  $$('[data-collection-select]').forEach((select) => select.addEventListener("change", () => { activeCollection[select.dataset.collectionSelect] = Number(select.value); syncControls(); }));
  $$('[data-collection]').forEach((input) => { input.addEventListener("focus", () => { interactionStart = clone(state); }); input.addEventListener("input", () => { state[input.dataset.collection][activeCollection[input.dataset.collection]][input.dataset.field] = input.value; render({ sync: false }); saveState(); }); input.addEventListener("change", () => { remember(interactionStart); interactionStart = null; }); });

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
    if (sectionSelect) sectionSelect.innerHTML = options.map((item) => `<option value="${item.value}">${item.label}</option>`).join("");
    const scopeSelect = $("[data-element-scope]");
    if (scopeSelect) scopeSelect.innerHTML = `<option value="">全部分区</option>${options.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}`;
  }
  $(".element-clear")?.addEventListener("click", () => { selectedElementKey = null; renderElementList(); syncElementInspector(); });
  function setPickerMode(active) { pickerMode = active; document.body.classList.toggle("element-picker-active", active); const button = $("[data-element-pick]"); button?.classList.toggle("is-active", active); button?.setAttribute("aria-pressed", String(active)); }
  $("[data-element-pick]")?.addEventListener("click", () => setPickerMode(!pickerMode));
  $(".element-reset")?.addEventListener("click", () => { if (!selectedElementKey) return; const previous = clone(state); delete state.elementStyles[selectedElementKey]; remember(previous); render(); saveState(); showToast("此元素已恢复默认"); });
  $(".element-delete")?.addEventListener("click", () => { if (!selectedElementKey) return; updateElementStyle(selectedElementKey, "deleted", true); showToast("元素已隐藏，可恢复"); });
  $(".element-add")?.addEventListener("click", () => { const type = $("[data-new-element-type]").value; const section = $("[data-new-element-section]").value; const id = `custom-${Date.now().toString(36)}`; const item = { id, type, section, text: type === "button" ? "新按钮" : type === "heading" ? "新标题" : type === "image" ? "自定义图片" : "新文本", href: "#", src: seedImages[0] }; const previous = clone(state); state.customElements.push(item); state.elementStyles[`custom:${id}`] = { positionMode: "free", align: "center", x: 50, y: 50, width: type === "image" ? 32 : 40, zIndex: 5 }; remember(previous); render(); selectedElementKey = `custom:${id}`; renderElementList(); syncElementInspector(); saveState(); showToast("已新增元素"); });
  $$("[data-position-mode]").forEach((button) => button.addEventListener("click", () => updateElementStyle(selectedElementKey, "positionMode", button.dataset.positionMode)));
  $$("[data-element-align]").forEach((button) => button.addEventListener("click", () => updateElementStyle(selectedElementKey, "align", button.dataset.elementAlign)));
  $$('[data-element-style="x"], [data-element-style="y"]').forEach((input) => { input.min = "-100"; input.max = "200"; });
  $$('[data-element-style="width"]').forEach((input) => { input.min = "5"; input.max = "200"; });
  $$('[data-element-style="height"]').forEach((input) => { input.min = "0"; input.max = "1600"; });
  $("[data-element-text]")?.addEventListener("input", (event) => { const element = elementRegistry.get(selectedElementKey); if (!element) return; const textBinding = element.dataset.bind || element.dataset.colorText; if (textBinding) { state[textBinding] = event.target.value; render({ sync: false }); saveState(); } else updateElementStyle(selectedElementKey, "text", event.target.value); });
  $("[data-element-href]")?.addEventListener("input", (event) => updateElementStyle(selectedElementKey, "href", event.target.value));
  $("[data-element-src]")?.addEventListener("input", (event) => updateElementStyle(selectedElementKey, "src", event.target.value));
  $("[data-element-color]")?.addEventListener("input", (event) => updateElementStyle(selectedElementKey, "color", event.target.value));
  $("[data-element-bg]")?.addEventListener("input", (event) => updateElementStyle(selectedElementKey, "backgroundColor", event.target.value));
  $$('[data-element-style]').forEach((input) => input.addEventListener("input", () => updateElementStyle(selectedElementKey, input.dataset.elementStyle, input.type === "checkbox" ? input.checked : input.value)));

  function toggleEditor(open) { document.body.classList.toggle("editor-open", open); if (!open) setPickerMode(false); $(".editor").setAttribute("aria-hidden", String(!open)); $(".edit-button").setAttribute("aria-expanded", String(open)); if (open) setTimeout(() => $(".editor-close").focus(), 280); else $(".edit-button").focus(); }
  $(".edit-button").addEventListener("click", () => toggleEditor(true)); $(".editor-close").addEventListener("click", () => toggleEditor(false)); $(".done-button").addEventListener("click", () => toggleEditor(false)); $(".editor-backdrop").addEventListener("click", () => toggleEditor(false));
  $$(".editor-tabs button").forEach((button) => button.addEventListener("click", () => { $$(".editor-tabs button").forEach((tab) => { const active = tab === button; tab.classList.toggle("is-active", active); tab.setAttribute("aria-selected", active); }); $$(".editor-panel").forEach((panel) => { panel.hidden = panel.dataset.panel !== button.dataset.tab; panel.classList.toggle("is-active", panel.dataset.panel === button.dataset.tab); }); }));
  $(".undo-button").addEventListener("click", () => { if (!past.length) return; future.push(clone(state)); state = past.pop(); render(); saveState(); }); $(".redo-button").addEventListener("click", () => { if (!future.length) return; past.push(clone(state)); state = future.pop(); render(); saveState(); });
  $$('[data-color]').forEach((button) => button.addEventListener("click", () => { const previous = clone(state); state.accent = button.dataset.color; remember(previous); render(); saveState(); }));

  function resizeImage(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onerror = reject; reader.onload = () => { const image = new Image(); image.onload = () => { const ratio = Math.min(1, 1920 / image.width, 1200 / image.height); const canvas = document.createElement("canvas"); canvas.width = image.width * ratio; canvas.height = image.height * ratio; canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL("image/jpeg", .82)); }; image.onerror = reject; image.src = reader.result; }; reader.readAsDataURL(file); }); }
  $$('[data-image-upload]').forEach((input) => input.addEventListener("change", async () => { const file = input.files?.[0]; if (!file) return; try { const previous = clone(state); state[input.dataset.imageUpload] = await resizeImage(file); remember(previous); render(); saveState(); showToast("图片已替换"); } catch { showToast("无法读取这张图片"); } input.value = ""; }));
  $$('[data-collection-image]').forEach((input) => input.addEventListener("change", async () => { const file = input.files?.[0]; if (!file) return; try { const previous = clone(state); state[input.dataset.collectionImage][activeCollection[input.dataset.collectionImage]].image = await resizeImage(file); remember(previous); render(); saveState(); showToast("集合图片已替换"); } catch { showToast("无法读取这张图片"); } input.value = ""; }));
  $(".export-button").addEventListener("click", () => { const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = "ashfall-home-config.json"; link.click(); URL.revokeObjectURL(url); showToast("配置已导出"); });
  $(".import-button input").addEventListener("change", async (event) => { try { const previous = clone(state); state = mergeConfig(JSON.parse(await event.target.files[0].text())); remember(previous); render(); saveState(); showToast("配置已导入"); } catch { showToast("配置文件格式不正确"); } event.target.value = ""; });
  $(".reset-button").addEventListener("click", () => { const previous = clone(state); state = clone(defaults); remember(previous); render(); saveState(); showToast("已恢复示例内容，可撤销"); });

  function setupRail(selector, prev, next, currentAttr) { const rail = $(selector); const step = () => { const card = rail.firstElementChild; if (!card) return 0; return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).gap) || 0); }; const move = (dir) => rail.scrollBy({ left: dir * step(), behavior: "smooth" }); $(prev).addEventListener("click", () => move(-1)); $(next).addEventListener("click", () => move(1)); rail.addEventListener("scroll", () => { const index = Math.max(0, Math.min(15, Math.round(rail.scrollLeft / step()))); $(currentAttr).textContent = String(index + 1).padStart(2, "0"); setActiveNews(index); }, { passive: true }); let down = false; let startX = 0; let startScroll = 0; rail.addEventListener("pointerdown", (event) => { down = true; startX = event.clientX; startScroll = rail.scrollLeft; rail.setPointerCapture(event.pointerId); rail.classList.add("is-dragging"); }); rail.addEventListener("pointermove", (event) => { if (down) rail.scrollLeft = startScroll - event.clientX + startX; }); ["pointerup", "pointercancel"].forEach((name) => rail.addEventListener(name, () => { down = false; rail.classList.remove("is-dragging"); })); }
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
  $(".watch-button")?.addEventListener("click", () => showToast("预告片将在下一版本上线"));
  $(".search-button")?.addEventListener("click", () => { $(".search-layer").classList.add("is-open"); $(".search-layer").setAttribute("aria-hidden", "false"); setTimeout(() => $("#site-search").focus(), 200); }); $(".search-close")?.addEventListener("click", () => { $(".search-layer").classList.remove("is-open"); $(".search-layer").setAttribute("aria-hidden", "true"); }); $(".search-form")?.addEventListener("submit", (event) => { event.preventDefault(); const query = $("#site-search").value.trim().toLowerCase(); const hits = query ? [...document.querySelectorAll("main h2, main h3, main p")].filter((el) => el.textContent.toLowerCase().includes(query)).length : 0; $(".search-result").textContent = query ? `找到 ${hits} 个相关内容` : "请输入关键词"; });
  $(".menu-button")?.addEventListener("click", () => { $(".menu-layer").classList.add("is-open"); $(".menu-layer").setAttribute("aria-hidden", "false"); }); $(".menu-close")?.addEventListener("click", () => { $(".menu-layer").classList.remove("is-open"); $(".menu-layer").setAttribute("aria-hidden", "true"); }); $$(".menu-layer a").forEach((link) => link.addEventListener("click", () => { $(".menu-layer").classList.remove("is-open"); $(".menu-layer").setAttribute("aria-hidden", "true"); }));
  $(".download-button")?.addEventListener("click", (event) => { if (!state.downloadUrl || state.downloadUrl === "#") { event.preventDefault(); showToast("请在编辑器中填写下载链接"); } });

  function revealInViewport() { $$(".reveal, .reveal-card, .media-reveal").forEach((element) => { const rect = element.getBoundingClientRect(); if (rect.top < window.innerHeight * .94 && rect.bottom > -40) element.classList.add("is-visible"); }); }
  let colorFrame; window.addEventListener("scroll", () => { const y = window.scrollY; $(".site-header").classList.toggle("is-scrolled", y > 40); const max = document.documentElement.scrollHeight - window.innerHeight; $(".scroll-progress span").style.width = `${max ? y / max * 100 : 0}%`; document.documentElement.style.setProperty("--hero-shift", `${Math.min(y * .04, 32)}px`); revealInViewport(); if (!colorFrame) colorFrame = requestAnimationFrame(() => { colorFrame = null; updateWordWave(); }); }, { passive: true }); window.addEventListener("resize", () => { revealInViewport(); updateWordWave(); }, { passive: true });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { if ($(".menu-layer").classList.contains("is-open")) $(".menu-close").click(); else if ($(".search-layer").classList.contains("is-open")) $(".search-close").click(); else if (document.body.classList.contains("editor-open")) toggleEditor(false); } if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && document.body.classList.contains("editor-open")) { event.preventDefault(); (event.shiftKey ? $(".redo-button") : $(".undo-button")).click(); } });

  function observeReveals() { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .08 }); $$(".reveal, .reveal-card, .media-reveal").forEach((element) => observer.observe(element)); }
  if (window.lucide) window.lucide.createIcons();
  syncElementScopes();
  render(); observeReveals(); revealInViewport();
  document.body.classList.add("page-ready");
  const params = new URLSearchParams(location.search); if (params.get("edit") === "1") toggleEditor(true); if (["manifesto", "news", "expertise", "about", "research", "sustainability", "download"].includes(params.get("view"))) setTimeout(() => { document.getElementById(params.get("view"))?.scrollIntoView(); revealInViewport(); }, 60);
})();
