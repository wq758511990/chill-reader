import * as vscode from 'vscode';
import { TextUtils } from '../utils/textUtils';
import { ConfigurationService } from '../services/ConfigurationService';

export interface RenderResult {
    decorations: vscode.DecorationOptions[];
    consumedLength: number;
    lineTexts: Map<number, string>;
}

export class RenderEngine {
    private configService: ConfigurationService;

    constructor() {
        this.configService = new ConfigurationService();
    }

    public render(
        editor: vscode.TextEditor, 
        text: string, 
        anchorLine?: number,
        currentPage?: number,
        totalPages?: number
    ): RenderResult {
        const linesPerPage = this.configService.getLinesPerPage();
        const charsPerLine = this.configService.getCharsPerLine();
        const wrappedLines = TextUtils.wrapText(text, charsPerLine); 
        
        const decorations: vscode.DecorationOptions[] = [];
        const lineTexts = new Map<number, string>();
        let consumedLength = 0;

        let startLine = 0;
        if (typeof anchorLine === 'number') {
            startLine = anchorLine;
        } else {
            const visibleRanges = editor.visibleRanges;
            if (visibleRanges.length === 0) return { decorations: [], consumedLength: 0, lineTexts };
            startLine = visibleRanges[0].start.line;
        }
        
        const linesToRender = Math.min(linesPerPage, wrappedLines.length);

        for (let i = 0; i < linesToRender; i++) {
            const lineInfo = wrappedLines[i];
            const lineIndex = startLine + i;
            if (lineIndex >= editor.document.lineCount) break;

            consumedLength += lineInfo.length;
            const line = editor.document.lineAt(lineIndex);
            const range = new vscode.Range(lineIndex, line.range.end.character, lineIndex, line.range.end.character);
            
            let contentText = ` // ${lineInfo.text}`; 
            
            // 只有在最后一行才显示页码
            if (i === linesToRender - 1 && currentPage !== undefined && totalPages !== undefined) {
                contentText += ` (${currentPage}/${totalPages})`;
            }

            lineTexts.set(lineIndex, lineInfo.text);
            decorations.push({
                range: range,
                renderOptions: {
                    after: {
                        contentText: contentText,
                    }
                }
            });
        }

        return { decorations, consumedLength, lineTexts };
    }
}