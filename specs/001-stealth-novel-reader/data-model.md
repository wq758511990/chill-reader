# 数据模型：隐蔽小说阅读器

## 1. 核心实体

### 书籍 (Book)
```typescript
interface Book {
  id: string;        // 文件路径的哈希值
  path: string;      // 磁盘绝对路径
  type: 'txt' | 'epub';
  encoding: string;  // 默认 utf-8
}
```

### 阅读状态 (ReaderState)
```typescript
interface ReaderState {
  bookId: string;
  currentPosition: number; // 字符偏移量或章节索引
  totalLength: number;
  lastReadTime: number;
  fontSize: number;
  linesPerPage: number; // 用户配置显示的行数
}
```

### 翻译缓存 (TranslationCache)
```typescript
interface TranslationCache {
  sourceText: string;
  translatedText: string;
  engine: string;
}
```

## 2. 状态迁移
- **加载**: 读取文件 -> 解析格式 -> 获取上次进度 -> 设置装饰器。
- **翻页**: 计算下一段文本 -> 更新装饰器 -> 异步保存进度。
- **隐藏**: 移除所有装饰器 -> 记录当前位置。
