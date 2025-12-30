# 技术研究报告：隐蔽小说阅读器

## 1. VSCode 虚拟文本展示 (Virtual Text)

- **决策**: 使用 `vscode.window.createTextEditorDecorationType` 配合 `before` 或 `after` 属性。
- **依据**: 这种方式产生的文本不属于文档内容，不会被 Git 识别，也不会触发代码检查（Linter），最符合隐蔽阅读需求。
- **结论**: 方案可行。通过 `color` 属性直接引用主题的 `codeLens.foreground` 或 `comment.foreground` 变量，可实现颜色自动适配。

## 2. 翻译 API 选择

- **决策**: 首选 `google-translate-api-browser` 的免费镜像接口作为默认配置，并提供自定义配置项。
- **理由**: 无需用户注册 API Key 即可快速上手，符合“即插即用”的体验。
- **备选方案**: 有道翻译、DeepL（需用户提供 Key）。

## 3. EPUB 文本提取

- **决策**: 使用 `epub` 库提取纯文本内容，忽略样式表和图片。
- **理由**: 隐蔽阅读不需要复杂排版，纯文本更易于伪装成注释。

## 4. 自动换行逻辑

- **决策**: 结合 `vscode.window.activeTextEditor.viewColumn` 的宽度动态计算每行字符数。
- **结论**: 需要在窗口大小变化事件 `onDidChangeTextEditorViewColumn` 中重新计算。
