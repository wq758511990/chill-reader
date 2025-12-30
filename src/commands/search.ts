import * as vscode from 'vscode';
import { ReaderController } from '../controllers/ReaderController';

export function registerSearchCommands(context: vscode.ExtensionContext, controller: ReaderController) {
    context.subscriptions.push(
        vscode.commands.registerCommand('chill-reader.search', () => {
            controller.searchDialog();
        })
    );
}
