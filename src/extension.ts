import * as vscode from 'vscode';
import { ReaderController } from './controllers/ReaderController';
import { registerStartCommand } from './commands/start';
import { TranslationHoverProvider } from './providers/TranslationHoverProvider';
import { registerNavigationCommands } from './commands/navigation';
import { registerSearchCommands } from './commands/search';

let controller: ReaderController;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "chill-reader" is now active!');

    controller = new ReaderController(context);

    // Register commands
    registerStartCommand(context, controller);
    registerNavigationCommands(context, controller);
    registerSearchCommands(context, controller);
    
    context.subscriptions.push(
        vscode.commands.registerCommand('chill-reader.nextPage', () => controller.nextPage()),
        vscode.commands.registerCommand('chill-reader.prevPage', () => controller.prevPage()),
        vscode.commands.registerCommand('chill-reader.bossKey', () => controller.stop())
    );

    // Register providers
    context.subscriptions.push(
        vscode.languages.registerHoverProvider('*', new TranslationHoverProvider(controller))
    );

    // Register events
    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(e => {
            // Optional: Re-render if necessary or handle selection changes
        }),
        vscode.window.onDidChangeTextEditorVisibleRanges(e => {
            controller.renderCurrentPage();
        }),
        vscode.window.onDidChangeActiveTextEditor(e => {
             controller.renderCurrentPage();
        })
    );
}

export function deactivate() {
    if (controller) {
        controller.dispose();
    }
}