# 任务清单：隐蔽小说阅读器 (Stealth Novel Reader)

**功能分支**: `001-stealth-novel-reader`
**关联规格**: `specs/001-stealth-novel-reader/spec.md`
**关联方案**: `specs/001-stealth-novel-reader/plan.md`

## 阶段 1：项目初始化 (Setup)
**目标**: 建立 VSCode 扩展开发环境，安装必要依赖。

- [x] T001 初始化 VSCode 扩展项目结构 (package.json, tsconfig.json)
- [x] T002 安装运行时依赖: `epubjs` (或 `epub`), `google-translate-api-browser`
- [x] T003 安装开发依赖: `@types/vscode`, `mocha`, `@types/mocha`
- [x] T004 配置测试运行环境 (.vscode/launch.json)

## 阶段 2：核心基础 (Foundation)
**目标**: 实现数据模型和核心服务，为上层功能提供支撑。

- [x] T005 [P] 定义核心接口 `Book`, `ReaderState` 于 `src/models/types.ts`
- [x] T006 [P] 实现 `FileService` 用于读取本地文件路径于 `src/services/FileService.ts`
- [x] T007 实现 `TxtParser` 解析 TXT 文件内容于 `src/services/parsers/TxtParser.ts`
- [x] T008 实现 `EpubParser` 解析 EPUB 文件文本于 `src/services/parsers/EpubParser.ts`
- [x] T009 [P] 实现 `ConfigurationService` 封装配置读取 (行数, 样式) 于 `src/services/ConfigurationService.ts`
- [x] T010 编写 Parser 单元测试于 `src/test/suite/parsers.test.ts`

## 阶段 3：用户场景 1 - 沉浸式隐蔽阅读 (Priority P1)
**目标**: 在编辑器中以代码注释形式显示小说内容，且支持自动换行。
**独立测试**: 加载 TXT 文件，内容显示为注释颜色；缩放窗口，内容自动适应。

- [x] T011 [US1] 实现 `DecoratorManager` 封装 `createTextEditorDecorationType` 于 `src/ui/DecoratorManager.ts`
- [x] T012 [US1] 实现核心渲染逻辑：将文本转换为 Decorator Options 于 `src/ui/RenderEngine.ts`
- [x] T013 [US1] 实现自动换行算法：根据 `visibleRanges` 和字符宽度计算断行于 `src/utils/textUtils.ts`
- [x] T014 [US1] 注册命令 `chill-reader.start` 触发文件选择和渲染于 `src/commands/start.ts`
- [x] T015 [US1] 监听 `onDidChangeTextEditorViewColumn` 事件实现响应式重绘于 `src/extension.ts`

## 阶段 4：用户场景 2 - 进度记忆与翻页控制 (Priority P1)
**目标**: 实现翻页控制、进度自动保存及“老板键”紧急隐藏。
**独立测试**: 翻页后重启插件，位置自动恢复；按下老板键内容瞬间消失。

- [x] T016 [US2] 实现 `PersistenceService` 封装 `globalState` 操作于 `src/services/PersistenceService.ts`
- [x] T017 [US2] 实现翻页逻辑 (Next/Prev) 并更新 `ReaderState` 于 `src/controllers/ReaderController.ts`
- [x] T018 [US2] 注册翻页快捷键命令 `chill-reader.nextPage`, `chill-reader.prevPage` 于 `package.json`
- [x] T019 [US2] 实现“老板键”及停止逻辑：立即清除所有装饰器，更新状态为“停止”，并记录当前位置于 `src/commands/bossKey.ts`
- [x] T020 [US2] 集成：在启动时检查并恢复上次阅读进度于 `src/controllers/ReaderController.ts`
- [x] T021 [US2] 编写阅读控制器单元测试于 `src/test/suite/readerController.test.ts`

## 阶段 5：用户场景 3 - 英文小说实时翻译 (Priority P2)
**目标**: 鼠标悬停显示单词翻译。
**独立测试**: 鼠标悬停英文单词，显示中文释义。

- [x] T022 [US3] 实现 `TranslationService` 集成翻译 API 于 `src/services/TranslationService.ts`
- [x] T023 [US3] 实现 `TranslationHoverProvider` 只有在阅读模式激活时生效于 `src/providers/TranslationHoverProvider.ts`
- [x] T024 [US3] 注册 Hover Provider 于 `src/extension.ts`
- [x] T025 [US3] 编写翻译服务的 Mock 测试于 `src/test/suite/translation.test.ts`

## 阶段 6：用户场景 4 - 高级导航与搜索 (Priority P2)
**目标**: 实现页码跳转和全文搜索功能。
**独立测试**: 输入页码能跳转；搜索关键词能列出结果并跳转。

- [x] T026 [US4] 实现 `PaginationService`: 根据 `pageSize` 配置计算总页数及偏移量映射于 `src/services/PaginationService.ts`
- [x] T027 [US4] 实现 `SearchService`: 在书籍内容中搜索关键词并返回 `SearchMatch[]` (含页码信息) 于 `src/services/SearchService.ts`
- [x] T028 [US4] 注册命令 `chill-reader.jumpToPage` 显示输入框并调用跳转逻辑于 `src/commands/navigation.ts`
- [x] T029 [US4] 注册命令 `chill-reader.search` 显示 QuickPick 列出搜索结果于 `src/commands/search.ts`

## 阶段 7：打磨与发布 (Polish)
**目标**: 确保隐蔽性在不同主题下有效，文档完善。

- [x] T030 [P] 验证 Light/Dark 主题下的注释颜色适配性
- [x] T031 [P] 完善 README.md 使用说明 (包含快捷键列表)
- [x] T032 性能检查：验证插件启动及书籍加载时间是否满足 SC-001 (<500ms)，确保大文件不阻塞 UI

## 依赖关系图
1. Setup (T001-T004) -> Foundation (T005-T010)
2. Foundation -> US1 (T011-T015)
3. US1 -> US2 (T016-T021) [部分依赖渲染逻辑]
4. Foundation -> US3 (T022-T025) [相对独立，可并行]

## 并行执行示例
- 开发者 A: 负责 Parser 实现 (T007, T008)
- 开发者 B: 负责 UI 渲染引擎 (T011, T012)
- 开发者 C: 负责翻译模块 (T022, T023)

## 实施策略
- **MVP**: 完成阶段 1, 2, 3 及 T017, T018 (可以看书，能翻页)。
- **v1.0**: 完成阶段 4 (进度保存，老板键)。
- **v1.1**: 完成阶段 5 (翻译功能)。
