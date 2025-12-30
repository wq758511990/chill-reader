import * as vscode from 'vscode';
import { ReaderController } from '../controllers/ReaderController';

export function registerStartCommand(context: vscode.ExtensionContext, controller: ReaderController) {
    context.subscriptions.push(
        vscode.commands.registerCommand('chill-reader.start', () => {
            controller.start();
        }),
        vscode.commands.registerCommand('chill-reader.open', () => {
            controller.open();
        })
    );
}
