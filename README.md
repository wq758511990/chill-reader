# Chill Reader (隐蔽阅读器)

**Chill Reader** 是一款专为 VSCode 设计的隐蔽小说阅读器。它将小说内容伪装成代码注释，让你在编码的同时享受阅读，完美平衡工作与放松。

## ✨ 核心功能

- 🛡️ **极度隐蔽**：内容以代码注释形式出现在行末，支持自定义颜色与透明度，完美融入各类主题。
- ⌨️ **快捷控制**：支持下一页、上一页、一键隐藏（老板键），操作行云流水。
- 📖 **智能进度**：自动记住每本书的阅读位置，下次启动直接续读。
- 🔍 **高效导航**：支持关键词全文搜索及精确页码跳转。
- 🌐 **悬浮翻译**：鼠标悬停在单词或小说行上，即刻显示中文翻译（内置稳定接口）。
- 📝 **格式支持**：全面支持 `.txt` 与 `.epub` 格式。

## 🚀 快速开始

1. **启动阅读**：按下 `Ctrl+Shift+P` / `Cmd+Shift+P` 打开命令面板，搜索 `Chill Reader: Continue / Start Reading`。
2. **切换书籍**：运行 `Chill Reader: Open New Book` 即可选择本地文件。
3. **导航与隐藏**：
   - `Chill Reader: Next Page` / `Previous Page`
   - `Chill Reader: Boss Key (Hide)` 一键清空所有阅读痕迹。
   - `Chill Reader: Search` 关键词搜索。

## ⚙️ 个性化配置

在 VSCode 设置中搜索 `Chill Reader` 即可调整：

- `charsPerLine`：每行显示字符数。
- `linesPerPage`：同时显示的行数。
- `customColor`：自定义文本颜色（如 `#6A9955`）。
- `opacity`：文本透明度。
- `cleanText`：自动清洗冗余换行符。

## ⌨️ 推荐快捷键

建议在 `keybindings.json` 中绑定以下快捷键以达到最佳体验：

```json
{
  "key": "alt+n",
  "command": "chill-reader.nextPage",
  "when": "editorTextFocus"
},
{
  "key": "alt+p",
  "command": "chill-reader.prevPage",
  "when": "editorTextFocus"
},
{
  "key": "alt+q",
  "command": "chill-reader.bossKey",
  "when": "editorTextFocus"
}
```

## 📜 免责声明

本插件仅供学习与交流使用，请合理安排阅读时间，避免影响正常工作。因使用本插件导致的相关后果由用户自行承担。