export interface Book {
  id: string;        // 文件路径的哈希值或路径本身
  path: string;      // 磁盘绝对路径
  type: 'txt' | 'epub';
  encoding: string;  // 默认 utf-8
  content?: string;  // 缓存的全文内容（对于小文件）
}

export interface ReaderState {
  bookId: string;
  currentPosition: number; // 字符偏移量或章节索引
  totalLength: number;
  lastReadTime: number;
  linesPerPage: number;
}

export interface TranslationCache {
  sourceText: string;
  translatedText: string;
  engine: string;
}

export interface SearchMatch {
    text: string;
    position: number;
    page: number;
    preview: string;
}
