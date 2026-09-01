# ASH/FALL 网页维护指南

本文档面向维护此项目的开发者和 AI 助手。项目是一个无构建步骤的静态网页：HTML 提供结构，CSS 提供视觉与动效，`app.js` 提供内容渲染、编辑器和本地保存。

## 入口与验证

- 页面入口：`index.html`
- 页面逻辑：`app.js`
- 全部样式：`styles.css`
- 位图素材：`assets/`
- 依赖：`package.json`
- 语法检查：`npm run check`
- 本地服务：`npm run dev`，默认端口见 `package.json`。该服务同时提供图片上传接口，不要用 `file://` 打开页面来上传图片。

修改后至少运行 `npm run check`。涉及布局、交互、编辑器或动效时，还要在浏览器中打开页面并验证对应流程。

## 修改顺序

1. 先阅读目标区块在 `index.html` 中的结构和 `data-*` 属性。
2. 再查找 `app.js` 是否通过绑定、集合渲染或元素注册接管了该节点。
3. 最后修改 `styles.css`。文件后半段存在针对首页复刻的覆盖规则，同名选择器以后出现的规则优先；改样式时要搜索同名选择器，避免只修改了较早的规则。
4. 修改完成后运行检查，再验证桌面和移动端。

保留用户已有的 `localStorage` 配置和未涉及的工作区修改。不要用重置或覆盖配置的方式“修复”页面。

## 内容模型

`app.js` 顶部的 `defaults` 是默认内容的单一事实来源。主要字段包括：

- 品牌与首屏：`brand`、`kicker`、`heroLine1`、`heroLine2`、`heroLine3`、`heroSummary`
- 宣言：`manifestoEyebrow`、`manifestoBody`
- 分区标题和正文：`newsTitle`、`newsBody`、`expertiseTitle`、`expertiseBody`、`aboutTitle`、`aboutBody`、`researchTitle`、`researchBody`、`sustainabilityTitle`、`sustainabilityBody`、`downloadTitle`
- 版本信息：`version`、`releaseDate`、`loader`、`downloadLabel`、`downloadUrl`
- 视觉参数：`accent`、`heroShade`、`heroFocus`、`textureGrain`、`mediaHighlight`、`glassOpacity`、`editorOpacity`
- 集合数据：`news[]`、`expertise[]`
- 编辑器数据：`elementStyles`、`customElements`、`pages`

带有 `data-bind="字段名"` 的节点由 `render()` 写入文本。带有 `data-image="字段名"` 的图片由 `render()` 写入 `src`。带有 `data-bind-href="字段名"` 的链接由 `render()` 写入 `href`。

新增绑定字段时必须同时完成三处：

1. 在 `defaults` 中加入默认值。
2. 在 `index.html` 中添加 `data-bind` 或对应属性。
3. 在编辑器内容面板中加入 `data-setting` 控件，或在集合面板中加入 `data-collection` 控件。

## 集合渲染

新闻集合由 `renderNews()` 生成，系统集合由 `renderExpertise()` 生成。不要只修改渲染后的 DOM，因为下一次 `render()` 会重建它们。

新闻元素 key 规则：

- 卡片：`news:<index>`
- 图片：`news:<index>:image`
- 内容容器：`news:<index>:content`
- 标题：`news:<index>:title`
- 元信息：`news:<index>:meta:0`、`news:<index>:meta:1`
- 摘要：`news:<index>:body`
- 按钮：`news:<index>:cta`

新增新闻卡片内部节点时，必须在 `elementKey()` 中给出稳定 key，避免同类 `<p>` 或 `<div>` 因索引变化而覆盖彼此的编辑配置。

## 元素编辑器

元素编辑器由以下流程组成：

1. `elementSelectors` 定义哪些 DOM 节点进入编辑器。
2. `refreshElementRegistry()` 建立 `elementKey -> DOM 节点` 映射。
3. `renderElementList()` 生成编号元素列表。
4. `syncElementInspector()` 将当前元素状态写入检查器。
5. `applyElementStyles()` 将 `state.elementStyles[key]` 写回 DOM。

每个元素的样式配置使用稳定 key 保存在 `state.elementStyles`。常用字段：

`text`、`href`、`src`、`opacity`、`color`、`backgroundColor`、`fontSize`、`borderRadius`、`paddingTop`、`paddingBottom`、`marginTop`、`marginBottom`、`height`、`width`、`positionMode`、`align`、`x`、`y`、`zIndex`、`translateY`、`hidden`、`deleted`、`motionOff`。

改变元素结构后，要同时检查：

- 是否仍被 `elementSelectors` 捕获。
- `elementKey()` 是否稳定且唯一。
- 容器元素是否会被 `children.length` 逻辑禁用文本编辑。
- 自由定位元素所在的分区是否有 `position: relative`。
- `render()` 重建集合后，样式是否再次应用。

自定义元素保存在 `customElements[]`，由 `renderCustomElements()` 创建到分区的 `.custom-elements-layer` 中。删除是软删除：设置 `deleted` 或 `hidden`，不要直接销毁配置，这样“恢复”仍然可用。

## 动效与材质

- 变色文字：`data-color-text` 由 `paintWords()` 分词，`updateWordWave()` 根据滚动位置推进五字符窗口。
- 新闻卡片：`.news-card-content` 默认透明，悬停、聚焦或激活时显示有限范围的毛玻璃。
- 图片高光和颗粒：使用 `assets/texture-highlight.png`、`assets/texture-glass.png`、`assets/texture-grain.png`。
- 鼠标光照变量：`--mx`、`--my`、`--light-x`、`--light-y`。

动效修改应优先调整 CSS transition、opacity、blur 和已有 CSS 变量。不要在 `app.js` 中持续创建动画定时器，除非已有滚动或交互循环无法满足需求。必须保留 `prefers-reduced-motion` 下的降级行为。

## 新增网页区块

新增一个首页分区时按以下顺序：

1. 在 `index.html` 的 `<main>` 中加入带唯一 `id` 的 `<section>`。
2. 给分区设置明确的颜色主题、图片节点和可绑定文本。
3. 在 `styles.css` 中先写桌面布局，再写 `max-width: 820px` 和 `max-width: 460px` 的移动规则。
4. 如果分区需要集合，新增数据字段和渲染函数，不要在 HTML 中留下空容器。
5. 将分区加入菜单、导航、元素分区筛选和需要的滚动入口。
6. 确认分区至少有稳定的 16:9 视觉高度约束，移动端再根据内容解除或降低最小高度。
7. 确认新节点被元素注册器捕获，并能通过编号列表和指针选择器编辑。

完成标准：刷新后内容仍出现；编辑器修改后刷新仍保留；桌面和移动端没有文字溢出、重叠或不可点击控件。

## 子页面系统

子页面使用 `index.html?page=<slug>` 静态路由，例如 `index.html?page=world-systems`。链接必须显式包含 `index.html`，这样通过服务器访问和直接双击本地文件时都能正常工作；部署到 GitHub Pages 等静态托管环境时也不需要服务器重写规则。

子页面保存在 `state.pages[]`，字段包括：

- 身份与导航：`id`、`slug`、`navLabel`、`published`
- 首屏：`eyebrow`、`title`、`summary`、`heroImage`
- 正文：`contentTitle`、`body`
- 行动按钮：`ctaLabel`、`ctaUrl`

编辑器的“子页”页签支持新增、复制、删除、预览、上传头图、复制链接，以及把首页按钮或图片快速连接到当前子页。`published` 只控制页面是否进入桌面导航和全屏菜单；草稿仍可通过其地址直接预览。

维护子页时注意：

1. `id` 是持久身份，创建后不要修改；`slug` 可以修改，但必须经过 `uniqueSlug()` 去重。
2. 子页正文节点使用 `data-page-field-display`，编辑器表单使用 `data-page-field`。两者都应指向 `pages[]` 中的同名字段。
3. 子页元素 key 以 `page:<id>:` 开头，因此不同页面的字号、位置和透明度不会互相覆盖。
4. 子页自定义元素带有 `pageId`；首页自定义元素的 `pageId` 为 `null`。渲染和删除时都要保持此归属关系。
5. 首页入口映射保存在 `state.homeLinks`，格式是 `{ [首页元素 key]: 子页 id }`。首页按钮和图片的元素 key 必须稳定；删除子页时也要清理指向该 `id` 的映射。
6. 子页 `body` 正文编辑上限为 30000 字（3W），编辑器保持至少 280px 高；不要重新加回 1800 字的短限制。
7. 正文网页宽度使用响应式 `clamp()`，桌面保留左侧分区标记和右侧留白，移动端保持 18px 边距；不要把正文固定为全屏宽度。
8. 新增子页模板分区时，桌面端至少保持 `max(100svh, 56.25vw)` 的视觉高度，并补充移动端布局。
9. 不要改成 `/slug/` 路由，除非部署端已经配置 history fallback 或为每个路径生成独立 HTML。

验证至少覆盖：首页、有效 `index.html?page=`、无效 `index.html?page=`、编辑器新增/修改/复制/删除、刷新后的本地保存，以及桌面与移动端首屏。

## 保存、导入和导出

本地配置 key 是 `ashfall-home-config-v2`。`saveState()` 在内容或样式变化后写入 `localStorage`；`pagehide` 会再次同步保存。导入时必须经过 `mergeConfig()`，让旧配置补齐新字段，不要直接把导入 JSON 当作完整 state 使用。

修改配置结构时：

- 提升 `configVersion`。
- 在 `mergeConfig()` 中补默认值和迁移逻辑。
- 保证旧的 `elementStyles`、`news`、`expertise` 不丢失。
- 用编辑器修改一项内容，刷新页面，确认值仍存在。

### 图片与 Git 存储

编辑器上传图片必须通过 `npm run dev` 提供的 `POST /api/upload`；服务器会将压缩后的图片写入 `assets/uploads/`，并根据用途生成可识别的文件名，例如 `page-world-systems-...jpg` 或 `news-01-...jpg`。`state` 只保存这个相对路径，不再把 Base64 图片写进 `localStorage`。上传后应检查 `git status`，并将 `assets/uploads/` 中需要发布的图片一并提交。

生产环境使用图床时，不要让静态网页直接携带图床密钥或调用 GitHub 写入接口。将图床返回的公开 HTTPS 地址填入图片字段（或在导入 JSON 中写入该地址）即可；`render()` 会原样设置图片 `src`。这样开发环境使用仓库内相对路径，发布环境使用图床 URL，两者无需修改渲染逻辑。

## 发布为面向用户的网页

编辑器只适合制作和维护阶段。发布前建议保留一个可编辑源版本，再生成一个 public 副本。

### 快速发布

适用于不需要继续在线编辑的静态展示：

1. 用编辑器完成内容、图片、元素位置和视觉参数调整。
2. 导出 JSON，并保留在源版本目录外作为备份。
3. 将最终配置中的文本、图片和集合内容固化到 `index.html` 或 public 数据文件。
4. 从 public `index.html` 删除编辑入口按钮、`<aside id="editor">`、编辑器遮罩和 toast 节点。
5. 从 public 页面移除 `app.js` 中仅服务编辑器的代码，或改为一个只负责新闻/系统集合渲染的精简脚本。不能在集合容器为空时直接删除整个 `app.js`，否则新闻和系统列表不会生成。
6. 清理编辑器相关 CSS：`.editor`、`.editor-*`、`.element-*`、`.toggle-row`、`.config-actions`、编辑器响应式规则。
7. 保留页面真正使用的 Lucide 图标脚本和图标标记；如果所有图标已改成内联 SVG，再删除 Lucide 依赖。

### 发布检查

- 页面中不存在编辑按钮、编辑器侧栏或编辑器遮罩。
- 浏览器刷新后新闻和系统集合仍然渲染。
- 页面不再读取或写入 `ashfall-home-config-v2`。
- 不会出现未加载的 `assets/` 路径。
- `npm run check` 通过；如果 public 版本移除了 `app.js`，则对保留脚本运行等价的语法检查。
- 桌面和移动端均可滚动，所有链接和图片可用。

### 推荐的目录策略

```text
网页/
  index.html                 # 可编辑源版本
  app.js                     # 可编辑源逻辑
  styles.css                 # 可编辑源样式
  DEVELOPER_GUIDE.md
  public/
    index.html               # 面向用户的发布版本
    styles.css
    app.js                    # 只保留页面运行所需逻辑
    assets/
```

发布版本应从源版本生成，而不是直接破坏源文件。这样后续仍可打开编辑器继续制作，再重新生成 public 版本。

## AI 助手工作协议

接手任务时先确认：

1. 用户是在修改源版本，还是在处理 public 发布版本。
2. 目标节点是否由 `render()`、`renderNews()`、`renderExpertise()` 或 `renderCustomElements()` 重建。
3. 是否存在旧的 `localStorage` 配置需要迁移。
4. 是否需要同时更新桌面和移动端 CSS。
5. 修改后是否需要保留编辑器能力。

完成前必须给出：修改文件、行为变化、验证命令和未验证的浏览器风险。避免无关重构和元数据变更。
