import { FileService } from '../FileService';

export class TxtParser {
    private fileService: FileService;

    constructor() {
        this.fileService = new FileService();
    }

    public async parse(filePath: string): Promise<string> {
        return await this.fileService.readFile(filePath);
    }
}
