import * as vscode from 'vscode';

export class ConfigurationService {
    public getPageSize(): number {
        return vscode.workspace.getConfiguration('chill-reader').get('pageSize', 1000);
    }

    public getCharsPerLine(): number {
        return vscode.workspace.getConfiguration('chill-reader').get('charsPerLine', 50);
    }

    public getLinesPerPage(): number {
        return vscode.workspace.getConfiguration('chill-reader').get('linesPerPage', 1);
    }

    public getOpacity(): number {
        return vscode.workspace.getConfiguration('chill-reader').get('opacity', 0.5);
    }

    public getCustomColor(): string {
        return vscode.workspace.getConfiguration('chill-reader').get('customColor', '');
    }

    public getCleanText(): boolean {
        return vscode.workspace.getConfiguration('chill-reader').get('cleanText', false);
    }
}
