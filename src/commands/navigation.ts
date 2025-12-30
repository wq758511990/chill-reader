import * as vscode from 'vscode';
import { ReaderController } from '../controllers/ReaderController';

export function registerNavigationCommands(context: vscode.ExtensionContext, controller: ReaderController) {
    context.subscriptions.push(
        vscode.commands.registerCommand('chill-reader.jumpToPage', () => {
            controller.jumpToPageDialog();
        })
    );
}
