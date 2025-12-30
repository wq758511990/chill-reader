import * as crypto from 'crypto';
import * as http from 'http';

export class TranslationService {
    // ==========================================
    // 请在此处填入您的百度翻译 AppID 和 Key
    // 申请地址：https://api.fanyi.baidu.com/
    // ==========================================
    private appId = '20251230002530021'; // <--- 填入 App ID
    private appKey = 'iNsu0fW7fdMbfICXmrCt'; // <--- 填入 App Key
    // ==========================================

    public async translate(text: string): Promise<string> {
        if (!this.appId || !this.appKey) {
            return "翻译服务未初始化，请开发者填入 Key";
        }

        const cleanText = text.replace(/\s+/g, ' ').trim();
        if (!cleanText) return "";

        return new Promise((resolve) => {
            const salt = Date.now();
            const sign = crypto.createHash('md5')
                .update(this.appId + cleanText + salt + this.appKey)
                .digest('hex');
            
            // 使用 HTTP 协议（百度翻译国内访问非常稳，HTTP 减少了握手开销）
            const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(cleanText)}&from=auto&to=zh&appid=${this.appId}&salt=${salt}&sign=${sign}`;

            const req = http.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (result && result.trans_result && result.trans_result.length > 0) {
                            resolve(result.trans_result[0].dst);
                        } else if (result.error_code) {
                            // 将 54003 (并发过高) 等常见错误友好提示
                            if (result.error_code === '54003') {
                                resolve("翻译过快，请稍后再试");
                            } else {
                                resolve(`百度翻译错误: ${result.error_code}`);
                            }
                        } else {
                            resolve("翻译无结果");
                        }
                    } catch (e) {
                        resolve("翻译解析异常");
                    }
                });
            });

            req.on('error', (e) => {
                resolve("网络请求失败: " + e.message);
            });
            
            req.setTimeout(3000, () => {
                req.destroy();
                resolve("翻译超时");
            });
        });
    }
}
