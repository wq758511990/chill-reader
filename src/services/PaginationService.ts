export class PaginationService {
    public getTotalPages(totalLength: number, displayCapacity: number): number {
        return Math.max(1, Math.ceil(totalLength / displayCapacity));
    }

    public getPageFromPosition(position: number, displayCapacity: number): number {
        return Math.floor(position / displayCapacity) + 1;
    }

    public getPositionFromPage(page: number, displayCapacity: number): number {
        return (page - 1) * displayCapacity;
    }
}