export class PaginationService {
    public getTotalPages(totalLength: number, pageSize: number): number {
        return Math.ceil(totalLength / pageSize);
    }

    public getPageFromPosition(position: number, pageSize: number): number {
        return Math.floor(position / pageSize) + 1;
    }

    public getPositionFromPage(page: number, pageSize: number): number {
        return (page - 1) * pageSize;
    }
}
