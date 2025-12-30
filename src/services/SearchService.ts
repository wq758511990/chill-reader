import { SearchMatch } from '../models/types';
import { PaginationService } from './PaginationService';

export class SearchService {
    private paginationService: PaginationService;

    constructor() {
        this.paginationService = new PaginationService();
    }

    public search(text: string, query: string, displayCapacity: number): SearchMatch[] {
        const matches: SearchMatch[] = [];
        if (!query || query.length === 0) return matches;

        // Escape regex special characters
        const escapedQuery = query.replace(/[.*+?^${}()|[\\]/g, '\\$&');
        const regex = new RegExp(escapedQuery, 'gi');
        
        let match;
        while ((match = regex.exec(text)) !== null) {
            const position = match.index;
            const page = this.paginationService.getPageFromPosition(position, displayCapacity);
            
            // Get preview context (10 chars before and after)
            const start = Math.max(0, position - 10);
            const end = Math.min(text.length, position + query.length + 10);
            const preview = text.substring(start, end).replace(/\n/g, ' '); // Inline newlines

            matches.push({
                text: match[0],
                position,
                page,
                preview: `...${preview}...`
            });

            // Limit results to avoid performance issues
            if (matches.length > 100) break;
        }

        return matches;
    }
}
