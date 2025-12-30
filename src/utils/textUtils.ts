export class TextUtils {
    /**
     * 智能贪婪折行：
     * 1. 忽略原书中的单行换行，将文字尽可能填满 maxCharsPerLine。
     * 2. 只有遇到连续换行（段落）或填满长度时才折行。
     * 3. 自动跳过纯空白区域。
     */
    public static wrapText(text: string, maxCharsPerLine: number): { text: string; length: number }[] {
        const lines: { text: string; length: number }[] = [];
        let i = 0;

        while (i < text.length) {
            let lineText = "";
            const startPos = i;
            
            // 跳过开头的空白（包括空格、制表符、换行符）
            while (i < text.length && /\s/.test(text[i])) {
                i++;
            }
            
            if (i >= text.length) {
                // 如果末尾全是空白，归入上一行长度
                if (lines.length > 0) {
                    lines[lines.length - 1].length += (i - startPos);
                }
                break;
            }

            // 抓取内容直到填满 maxCharsPerLine
            while (lineText.length < maxCharsPerLine && i < text.length) {
                const char = text[i];
                const nextChar = text[i + 1];

                // 遇到段落标识（双换行 \n\n 或 \n\r\n），强制切行
                if (char === '\n' && (nextChar === '\n' || nextChar === '\r')) {
                    // 跳过这一组换行符
                    i += (nextChar === '\r' ? 3 : 2);
                    break;
                }

                // 遇到单换行，转为空格处理（不折行）
                if (char === '\n' || char === '\r') {
                    if (lineText.length > 0 && lineText[lineText.length - 1] !== ' ') {
                        lineText += " ";
                    }
                    i++;
                    continue;
                }

                lineText += char;
                i++;
            }

            const finalLine = lineText.trim();
            if (finalLine.length > 0) {
                lines.push({
                    text: finalLine,
                    length: i - startPos
                });
            }
        }

        return lines;
    }
}