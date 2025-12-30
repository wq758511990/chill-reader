import * as vscode from 'vscode';
import { TranslationService } from '../services/TranslationService';
import { ReaderController } from '../controllers/ReaderController';

export class TranslationHoverProvider implements vscode.HoverProvider {
    private translationService: TranslationService;

    constructor(private readerController: ReaderController) {
        this.translationService = new TranslationService();
    }

    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | undefined> {
        if (!this.readerController.getIsReading()) {
            return undefined;
        }

        // 1. 获取当前行的小说文本（基于行号判断，不管 character 位置）
        const novelText = this.readerController.getNovelTextForLine(position.line);

        // 2. 检查鼠标是否悬停在实际代码单词上
        const range = document.getWordRangeAtPosition(position);
        if (range) {
            const word = document.getText(range);
            if (/^[a-zA-Z\-]+$/.test(word)) {
                const translation = await this.translationService.translate(word);
                // 如果该行有小说内容，我们把单词翻译和小说翻译都显示出来
                let hoverText = `**${word}**: ${translation}`;
                if (novelText) {
                    const novelTranslation = await this.translationService.translate(novelText);
                    hoverText += `\n\n---\n\n**小说翻译:**\n\n${novelTranslation}`;
                }
                return new vscode.Hover(new vscode.MarkdownString(hoverText));
            }
        }

        // 3. 如果没指在单词上，但这一行有小说内容（即鼠标指在行末空白处/小说文字处）
        if (novelText) {
            const translation = await this.translationService.translate(novelText);
            return new vscode.Hover(new vscode.MarkdownString(`**小说翻译:**\n\n${translation}`));
        }

        return undefined;
    }
}
