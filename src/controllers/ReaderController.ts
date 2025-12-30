import * as vscode from 'vscode';
import { FileService } from '../services/FileService';
import { TxtParser } from '../services/parsers/TxtParser';
import { EpubParser } from '../services/parsers/EpubParser';
import { DecoratorManager } from '../ui/DecoratorManager';
import { RenderEngine } from '../ui/RenderEngine';
import { Book, ReaderState } from '../models/types';
import { ConfigurationService } from '../services/ConfigurationService';
import { PersistenceService } from '../services/PersistenceService';
import { PaginationService } from '../services/PaginationService';
import { SearchService } from '../services/SearchService';

export class ReaderController {
    private fileService: FileService;
    private txtParser: TxtParser;
    private epubParser: EpubParser;
    private decoratorManager: DecoratorManager;
    private renderEngine: RenderEngine;
    private configService: ConfigurationService;
    private persistenceService: PersistenceService;
    private paginationService: PaginationService;
    private searchService: SearchService;
    
    private currentBook: Book | undefined;
    private currentText: string = "";
    private currentState: ReaderState | undefined;
    private isReading: boolean = false;

    // For precise navigation
    private lineToTextMap: Map<number, string> = new Map();
    private currentParams = {
        pageConsumedLength: 0
    };
    private positionHistory: number[] = [];
    private anchorLine: number | undefined;

    constructor(private context: vscode.ExtensionContext) {
        this.fileService = new FileService();
        this.txtParser = new TxtParser();
        this.epubParser = new EpubParser();
        this.decoratorManager = new DecoratorManager();
        this.renderEngine = new RenderEngine();
        this.configService = new ConfigurationService();
        this.persistenceService = new PersistenceService(context);
        this.paginationService = new PaginationService();
        this.searchService = new SearchService();
    }

    public async start() {
        const lastBookPath = this.persistenceService.getLastBookPath();
        if (lastBookPath) {
            await this.loadBook(lastBookPath);
        } else {
            await this.open();
        }
    }

    public async open() {
        const fileUris = await vscode.window.showOpenDialog({
            canSelectMany: false,
            openLabel: 'Open Novel',
            filters: {
                'Novel Files': ['txt', 'epub']
            }
        });

        if (fileUris && fileUris[0]) {
            await this.loadBook(fileUris[0].fsPath);
        }
    }

    public async loadBook(filePath: string) {
        try {
            // Capture current cursor line as anchor
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                // If there's a selection, use it. Otherwise undefined (will default to top visible).
                // Actually, let's always try to capture cursor position if available.
                this.anchorLine = editor.selection.active.line;
            } else {
                this.anchorLine = undefined;
            }

            this.currentBook = await this.fileService.getBook(filePath);
            
            // Save as last book
            await this.persistenceService.saveLastBookPath(filePath);
            
            if (this.currentBook.type === 'txt') {
                this.currentText = await this.txtParser.parse(filePath);
            } else {
                this.currentText = await this.epubParser.parse(filePath);
            }

            // Apply cleaning if enabled
            if (this.configService.getCleanText()) {
                // Normalize newlines
                this.currentText = this.currentText.replace(/\r\n/g, '\n');
                // Replace 3+ newlines with 2
                this.currentText = this.currentText.replace(/\n{3,}/g, '\n\n');
            }

            // Restore state or init
            const savedState = this.persistenceService.getState(this.currentBook.id);
            if (savedState) {
                this.currentState = savedState;
                this.currentState.pageSize = this.configService.getPageSize();
                this.currentState.linesPerPage = this.configService.getLinesPerPage();
                // We don't restore history perfectly, but that's acceptable for reload
                this.positionHistory = []; 
            } else {
                this.currentState = {
                    bookId: this.currentBook.id,
                    currentPosition: 0,
                    totalLength: this.currentText.length,
                    lastReadTime: Date.now(),
                    pageSize: this.configService.getPageSize(),
                    linesPerPage: this.configService.getLinesPerPage()
                };
                this.positionHistory = [];
            }

            this.isReading = true;
            this.renderCurrentPage();
        } catch (err: any) {
            vscode.window.showErrorMessage(`Failed to load book: ${err.message}`);
        }
    }

    public nextPage() {
        if (!this.isReading || !this.currentState) return;
        
        // Push current position to history before moving
        this.positionHistory.push(this.currentState.currentPosition);

        const nextPos = this.currentState.currentPosition + this.currentParams.pageConsumedLength;
        
        if (nextPos < this.currentState.totalLength) {
            this.currentState.currentPosition = nextPos;
            this.updateState();
            this.renderCurrentPage();
        }
    }

    public prevPage() {
        if (!this.isReading || !this.currentState) return;

        // Try to pop from history
        const prevPos = this.positionHistory.pop();
        
        if (prevPos !== undefined) {
            this.currentState.currentPosition = prevPos;
            this.updateState();
            this.renderCurrentPage();
        } else {
            // Fallback if history is empty (e.g. after restart), estimate back
            // Estimate based on charsPerLine * linesPerPage
            const charsPerLine = this.configService.getCharsPerLine();
            const linesPerPage = this.configService.getLinesPerPage();
            const estimatedBack = charsPerLine * linesPerPage;
            
            let newPos = this.currentState.currentPosition - estimatedBack;
            if (newPos < 0) newPos = 0;
            
            if (newPos !== this.currentState.currentPosition) {
                this.currentState.currentPosition = newPos;
                this.updateState();
                this.renderCurrentPage();
            }
        }
    }
    
    public async jumpToPageDialog() {
        if (!this.isReading || !this.currentState) return;

        const totalPages = this.paginationService.getTotalPages(this.currentState.totalLength, this.currentState.pageSize);
        const currentPage = this.paginationService.getPageFromPosition(this.currentState.currentPosition, this.currentState.pageSize);

        const input = await vscode.window.showInputBox({
            prompt: `Jump to Page (Current: ${currentPage} / Total: ${totalPages})`,
            placeHolder: `Enter page number (1 - ${totalPages})`,
            validateInput: (value) => {
                const page = parseInt(value);
                if (isNaN(page) || page < 1 || page > totalPages) {
                    return `Please enter a valid page number between 1 and ${totalPages}`;
                }
                return null;
            }
        });

        if (input) {
            const page = parseInt(input);
            const newPos = this.paginationService.getPositionFromPage(page, this.currentState.pageSize);
            
            this.positionHistory.push(this.currentState.currentPosition); // Save state before jump
            this.currentState.currentPosition = newPos;
            this.updateState();
            this.renderCurrentPage();
        }
    }

    public async searchDialog() {
        if (!this.isReading || !this.currentState) return;

        const query = await vscode.window.showInputBox({
            prompt: 'Search in Novel',
            placeHolder: 'Enter keyword...'
        });

        if (query) {
            const matches = this.searchService.search(this.currentText, query, this.currentState.pageSize);
            if (matches.length === 0) {
                vscode.window.showInformationMessage(`No matches found for "${query}"`);
                return;
            }

            const items = matches.map(match => ({
                label: `Page ${match.page}`,
                description: match.preview,
                match: match
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: `Found ${matches.length} matches`
            });

            if (selected) {
                this.positionHistory.push(this.currentState.currentPosition); // Save state before jump
                
                // Jump to the exact position of the match, or page start
                // Here we jump to the start of the logical page containing the match
                const pageStart = this.paginationService.getPositionFromPage(selected.match.page, this.currentState.pageSize);
                this.currentState.currentPosition = pageStart;
                
                this.updateState();
                this.renderCurrentPage();
            }
        }
    }

    public stop() {
        this.isReading = false;
        this.decoratorManager.dispose();
        if (this.currentState) {
             this.persistenceService.saveState(this.currentState);
        }
    }

    public getIsReading(): boolean {
        return this.isReading;
    }

    private updateState() {
        if (this.currentState) {
            this.currentState.lastReadTime = Date.now();
            this.persistenceService.saveState(this.currentState);
        }
    }

    public renderCurrentPage() {
        if (!this.isReading) return;

        const editor = vscode.window.activeTextEditor;
        if (!editor || !this.currentState) return;

        // Use captured anchorLine, or fallback to something safe (though render engine handles visible range fallback)
        let renderLine = this.anchorLine;
        
        // Safety check if document changed drastically (e.g. lines deleted)
        if (renderLine !== undefined && renderLine >= editor.document.lineCount) {
            renderLine = editor.document.lineCount - 1;
        }

        // Get a chunk of text to render
        // We take enough text to cover the needed lines
        const linesPerPage = this.configService.getLinesPerPage();
        const charsPerLine = this.configService.getCharsPerLine();
        const estimatedChunkSize = linesPerPage * (charsPerLine + 50); // +50 buffer
        
        const start = this.currentState.currentPosition;
        const end = Math.min(start + estimatedChunkSize, this.currentText.length);
        const textToRender = this.currentText.substring(start, end);

        // Render
        const result = this.renderEngine.render(editor, textToRender, renderLine);
        
        // Update map for translation
        this.lineToTextMap = result.lineTexts;
        
        // Update consumed length for next page calculation
        this.currentParams.pageConsumedLength = result.consumedLength;

        editor.setDecorations(this.decoratorManager.getDecorationType(), result.decorations);
    }
    
    public getNovelTextForLine(line: number): string | undefined {
        return this.lineToTextMap.get(line);
    }
    
    public dispose() {
        this.stop();
        this.decoratorManager.dispose();
    }
}
