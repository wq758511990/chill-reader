import * as assert from 'assert';

suite('Translation Test Suite', () => {
    test('Mock translation', async () => {
        // Mocking the external API call
        const mockTranslate = async (text: string) => {
            if (text === 'hello') return '你好';
            return 'unknown';
        };

        const result = await mockTranslate('hello');
        assert.strictEqual(result, '你好');
    });
});
