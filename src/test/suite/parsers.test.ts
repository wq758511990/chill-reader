import * as assert from 'assert';
import * as path from 'path';
import { TxtParser } from '../../services/parsers/TxtParser';

suite('Parser Test Suite', () => {
    test('TxtParser should read file content', async () => {
        const parser = new TxtParser();
        // Create a dummy file or use a known path. 
        // For unit tests in VSCode extension, we often need fixtures.
        // Let's assume we can mock FileService or just test logic if extracted.
        // For integration test with real file system:
        
        const testFilePath = path.resolve(__dirname, '../../../../package.json'); // Use package.json as a dummy txt file
        const content = await parser.parse(testFilePath);
        assert.ok(content.length > 0);
        assert.ok(content.includes('chill-reader'));
    });
});
