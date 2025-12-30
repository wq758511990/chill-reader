import * as vscode from 'vscode';
import { ReaderState } from '../models/types';

export class PersistenceService {
    constructor(private context: vscode.ExtensionContext) {}

    public async saveLastBookPath(path: string): Promise<void> {
        await this.context.globalState.update('chill-reader.lastBookPath', path);
    }

    public getLastBookPath(): string | undefined {
        return this.context.globalState.get<string>('chill-reader.lastBookPath');
    }

    public async saveState(state: ReaderState): Promise<void> {
        await this.context.globalState.update(this.getStateKey(state.bookId), state);
    }

    public getState(bookId: string): ReaderState | undefined {
        return this.context.globalState.get<ReaderState>(this.getStateKey(bookId));
    }
    
    public async clearState(bookId: string): Promise<void> {
        await this.context.globalState.update(this.getStateKey(bookId), undefined);
    }

    private getStateKey(bookId: string): string {
        return `chill-reader.state.${bookId}`;
    }
}
