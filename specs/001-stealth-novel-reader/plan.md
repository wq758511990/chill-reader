# 技术实施方案：隐蔽小说阅读器 (Stealth Novel Reader)

**关联规格说明书**: `specs/001-stealth-novel-reader/spec.md`  
**功能分支**: `001-stealth-novel-reader`  
**状态**: 计划中

## 技术上下文

### 核心技术决策
- **VSCode 扩展 API**: 使用 `TextEditorDecorationType` 来实现“伪装注释”效果。这种方式可以在不修改原代码文件内容的前提下，在编辑器内插入虚拟文本（After/Before content）。
- **EPUB 解析**: 使用 `epubjs` 或类似的轻量级库来处理 EPUB 格式。
- **翻译集成**: 默认集成 Google 翻译 API（或通过 `google-translate-api-browser`），并保留接口以便后续扩展其他引擎。
- **状态存储**: 使用 VSCode 的 `ExtensionContext.globalState` 或 `workspaceState` 持久化阅读进度。
- **分页逻辑**: 采用“逻辑分页”，即根据用户配置的 `pageSize` (字符数) 将全文划分为逻辑页。页码 N 对应偏移量范围 `[(N-1)*pageSize, N*pageSize)`。
- **搜索实现**: 基于流式读取或内存缓存（视文件大小而定）进行正则/字符串匹配，计算匹配项偏移量并映射为逻辑页码。

### 待确认事项 (NEEDS CLARIFICATION)
1. **[NEEDS CLARIFICATION: 翻译引擎选择]**: 默认使用免费翻译接口还是需要用户提供 API Key？
2. **[NEEDS CLARIFICATION: EPUB 复杂性]**: 是否需要支持 EPUB 中的图片和复杂排版，还是仅提取文本？（初步假设仅提取文本以符合“摸鱼”属性）。

## 项目宪法检查 (Constitution Check)

依据 `.specify/memory/constitution.md`：
- **核心原则**:
    - [x] **库优先**: 核心阅读与翻译逻辑应封装为独立的模块。
    - [x] **测试驱动**: 必须为文件解析和翻译接口编写单元测试。
    - [x] **可观测性**: 记录解析失败和 API 调用的关键日志。

## 实施阶段

### 阶段 0：研究与预研 (Research)
- **目标**: 解决技术不确定性，验证 VSCode 装饰器显示多行文本的性能。
- **交付物**: `research.md`

### 阶段 1：设计与合同 (Design)
- **目标**: 定义数据结构和内部模块接口。
- **交付物**: `data-model.md`, `contracts/`, `quickstart.md`

### 阶段 2：开发与验证 (Implementation)
- **目标**: 完成核心功能开发并确保测试通过。
- **交付物**: 源代码、单元测试。

## 质量门禁 (Quality Gates)
- [ ] 所有单元测试通过。
- [ ] 隐蔽性视觉测试通过（在不同主题下均显示为注释颜色）。
- [ ] 翻页和进度保存逻辑在异常关闭后仍能恢复。