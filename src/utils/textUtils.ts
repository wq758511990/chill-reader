import * as vscode from 'vscode';

export interface WrappedLine {
    text: string;
    length: number; 
}

export class TextUtils {
    /**
     * Strictly splits text into chunks of maxChars length.
     * Replaces newlines with spaces to ensure continuous flow.
     */
    public static wrapText(text: string, maxChars: number = 50): WrappedLine[] {
        // 1. Flatten the text: Replace newlines with spaces
        // We do this chunk by chunk to preserve 'length' mapping conceptually, 
        // but since we are modifying the text structure (replacing \n with space is 1-to-1), length is preserved!
        // Wait, \r\n is 2 chars -> 1 space? No, let's keep it simple.
        // Just treat newlines as regular characters, but for DISPLAY, we replace them.
        // Actually, if we replace \n with space in the output 'text', it looks good.
        // The 'length' property should be the length CONSUMED from the input string.
        
        const lines: WrappedLine[] = [];
        let cursor = 0;
        
        while (cursor < text.length) {
            let chunkLength = Math.min(maxChars, text.length - cursor);
            let chunkText = text.substring(cursor, cursor + chunkLength);
            
            // Replace newlines with spaces for display purposes
            // This ensures no "weird characters" or line breaks break the decoration
            let displayText = chunkText.replace(/[\r\n]+/g, ' ');
            
            lines.push({
                text: displayText,
                length: chunkLength
            });
            
            cursor += chunkLength;
        }
        
        return lines;
    }
}