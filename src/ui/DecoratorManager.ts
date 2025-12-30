import * as vscode from 'vscode';
import { ConfigurationService } from '../services/ConfigurationService';

export class DecoratorManager {
    private decorationType: vscode.TextEditorDecorationType | undefined;
    private configService: ConfigurationService;

    constructor() {
        this.configService = new ConfigurationService();
    }

    public getDecorationType(): vscode.TextEditorDecorationType {
        if (!this.decorationType) {
            this.createDecorationType();
        }
        return this.decorationType!;
    }

    public updateDecorationType() {
        if (this.decorationType) {
            this.decorationType.dispose();
        }
        this.createDecorationType();
    }

    private createDecorationType() {
        const opacity = this.configService.getOpacity();
        const customColor = this.configService.getCustomColor();
        
        const color = customColor ? customColor : new vscode.ThemeColor('editorCodeLens.foreground');

        this.decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                color: color,
                margin: '0 0 0 20px',
                textDecoration: `none; opacity: ${opacity}`
            },
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });
    }

    public dispose() {
        if (this.decorationType) {
            this.decorationType.dispose();
            this.decorationType = undefined;
        }
    }
}
