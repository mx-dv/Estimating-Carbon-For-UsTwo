import * as mockttp from 'mockttp';
import * as fs from 'fs';
import * as path from 'path';
import { RawBodyIncludesMatcher } from 'mockttp/dist/rules/matchers';

// 1. Clean Environment: Ensure this process ignores the VS Code proxy settings
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.NO_PROXY = '*';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let server: mockttp.Mockttp | null = null;

process.on('message', async (msg: any) => {
    if (msg.command === 'start') {
        await startServer(msg.port, msg.storagePath);
    } else if (msg.command === 'stop') {
        if (server) { await server.stop(); };
        process.exit(0);
    }
});

async function startServer(port: number, storagePath: string) {
    try {
        if (!fs.existsSync(storagePath)) { fs.mkdirSync(storagePath, { recursive: true }); };

        // Generate and Save CA
        const https = await mockttp.generateCACertificate();
        const certPath = path.join(storagePath, 'mockttp-ca.pem');
        fs.writeFileSync(certPath, https.cert);

        server = mockttp.getLocal({ https, debug: true });
        await server.enableDebug();

        await server.forAnyRequest().thenPassThrough({
            ignoreHostHttpsErrors: true,
            beforeRequest: async (req) => {
                const body = await req.body.getText() || '';

                // Log Request
                sendLog(`[REQUEST] ${req.method} ${req.url}`);

                // === TOKEN EXTRACTION LOGIC ===
                detectTokens(req.headers, body);
                // ==============================

                if (body) { sendLog(`Body: ${body.substring(0, 200)}...`); };
                sendLog('------------------------------------------------');
            },
            beforeResponse: async (res) => {
                const status = res.statusCode;
                // sendLog(`[RESPONSE] Status: ${res.statusCode}`);

                try {
                    const body = await res.body.getText() || "";
                    const preview = RawBodyIncludesMatcher.length > 2000
                        ? body.substring(0, 2000) + "... (Shortened to 2000 chars)"
                        : body;
                    sendLog(` << status: ${status}`);
                    sendLog(` << body: ${preview}`);
                } catch (error) {
                    sendLog(` << status: ${status}`);
                    sendLog(` << body could not interpreted as text?!?!?`);
                }
                sendLog('='.repeat(40));
            }
        });

        await server.start(port);

        // Notify parent that we started and where the cert is
        if (process.send) { process.send({ type: 'started', certPath }); };

    } catch (error: any) {
        if (process.send) { process.send({ type: 'error', message: error.toString() }); };
    }
}

function sendLog(message: string) {
    if (process.send) { process.send({ type: 'log', message }); };
}

// === MVP Token Detection ===
function detectTokens(headers: mockttp.Headers, body: string) {
    const TOKEN_KEYS = ['authorization', 'x-api-key', 'api-key', 'token', 'access_token'];

    // 1. Check Headers
    Object.keys(headers).forEach(key => {
        if (TOKEN_KEYS.includes(key.toLowerCase())) {
            sendLog(`TOKENS DETECTED `);//(Header [${key}]): ${headers[key]}`);
        }
    });

    // 2. Check Body (JSON)
    if (body && (body.startsWith('{') || body.startsWith('['))) {
        try {
            scanJsonForTokens(JSON.parse(body));
        } catch (e) { /* ignore non-json */ }
    }
}

function scanJsonForTokens(obj: any) {
    const TOKEN_MATCHERS = [/token/i, /key/i, /auth/i, /secret/i];
    if (!obj || typeof obj !== 'object') { return; };

    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (TOKEN_MATCHERS.some(m => m.test(key)) && typeof value === 'string' && value.length > 8) {
            sendLog(`TOKEN DETECTED `);//(Body JSON [${key}]): ${value}`);
        }
        if (typeof value === 'object') { scanJsonForTokens(value); };
    });
}