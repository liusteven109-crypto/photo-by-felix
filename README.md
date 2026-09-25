# Photo by Felix

Felix 的两场摄影展，共用一个 GitHub Pages 站点。

- [光影诗集](https://liusteven109-crypto.github.io/photo-by-felix/)：原有的 47 张摄影作品。
- [窗光作品展](https://liusteven109-crypto.github.io/photo-by-felix/window-light/)：58 幅作品，按风景（6）、人文（23）、光影（10）、人像（19）四章展开，包含 5 张窗光人像与「家的温度」6 幅家庭摄影及拼贴。

## 发布

GitHub Pages 从 `main` 分支根目录发布。修改对应目录并推送后会自动更新。首页为 `index.html`，窗光版为 `window-light/index.html`。资源使用相对路径，两个版本可以独立维护。

摄影作品版权归 Felix 所有。合作联系：liufei109@163.com。

## 2026-09-19 展览编排

窗光版以「从远方，到身旁」为主题。章节目录固定在顶部，点击照片后按当前章节顺序浏览。原有光影诗集保留。

「家的温度」展示《一起长大》《满堂笑语》，将《掌心的世界》《举起晴天》并列，最后展示两幅家庭拼贴。保留完整构图；可从 `window-light/#family` 直接进入。

露营组照「风里的童年」3 张（含原有《追风》）与生日组照「岁月欢聚」2 张收入人文章；《喜字之间》收入光影章。

新增香水湖组照「湖畔的童年」7 张，从玩耍、落叶到湖边相伴，位于人文章，可从 `window-light/#lakeside` 直达。草原与贵州花田 3 张组成「在路上的笑容」，位于人像章，可从 `window-light/#travel-portraits` 直达。《拾级一瞬》《一窗山野》收入光影章。全部保留原始构图，以 900px / 1800px WebP 展示副本加载。

## 2026-09-22 精简选片

撤下竖版红海滩《红原》；近似构图中保留《枝头片刻》《追风》《光里出神》《掌心的世界》《满堂笑语》《笑成一朵花》，撤下《雾隐》《奔向午后》《一起奔跑》《浅笑》《托举》《团圆》《春日探身》。撤下与单张重复的《亲密日常》拼图。原始照片与展示副本保留，当前展览及大图列表共 58 幅。

## 2026-09-25 摄影书式排版

58 幅作品编成 24 组跨页：主图与伴图、双幅、三联、竖幅与两张横幅搭配。暖纸色开篇以《海天之间》和《仰光》引入，光影章节使用深色展墙。露营、湖畔、婚礼与家庭分别形成连续段落。照片始终按原始比例完整展示；手机重新编排主图、成对竖幅与横幅，长拼贴独立限宽。

编排借鉴 [Nadav Kander 的系列组织](https://www.nadavkander.com/works-in-series) 与 [川内伦子 M/E 展览的摄影书式观看关系](https://rinkokawauchi-me.exhibit.jp/en/works/)。展示的摄影作品均为 Felix 的原有选片。

维护入口：`_tools/layout_exhibition.py` 保存组图顺序，`_tools/exhibition.html` 保存页面模板，`window-light/styles.css` 保存布局样式。在仓库根目录运行 `python3 _tools/layout_exhibition.py` 生成 HTML 与灯箱顺序；无需安装依赖。生成器会校验 58 张选片完整且无重复。生成文件提交后由 GitHub Pages 发布。
