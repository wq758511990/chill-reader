import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Book } from '../models/types';

export class FileService {
    public async getBook(filePath: string): Promise<Book> {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const stats = fs.statSync(filePath);
        if (!stats.isFile()) {
            throw new Error(`Path is not a file: ${filePath}`);
        }

        const ext = path.extname(filePath).toLowerCase();
        let type: 'txt' | 'epub';

        if (ext === '.txt') {
            type = 'txt';
        } else if (ext === '.epub') {
            type = 'epub';
        } else {
            throw new Error(`Unsupported file type: ${ext}`);
        }

        const id = crypto.createHash('md5').update(filePath).digest('hex');

        return {
            id,
            path: filePath,
            type,
            encoding: 'utf-8' // Default encoding
        };
    }

    public readFile(filePath: string, encoding: BufferEncoding = 'utf-8'): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, encoding, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}
