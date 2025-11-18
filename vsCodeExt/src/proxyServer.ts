// Generate the https server and dynamically generate certificates when a client connects

import * as http from 'http';
import * as net from 'net';
import { URL } from 'url';

export class InterceptorProxy {
    private server: http.Server;
    private port: number;
    private isRunning: boolean = false;

    constructor(port: number) {
        this.port = port;
        this.server = http.createServer();
    }

    public start() {
        this.server.on('request', (req, res) => {
            console.log("[HTTP] Intercepted: ${req.url}");
            this.handleHttpRequest(req, res);
        });

        this.server.on('connect', (req, clientSocket, head) => {
            console.log("[HTTPS] Intercepted: ${req.url}");
            // HERE NEED TO IMPLEMENT SSL CERTIFICATE GENERATION AND HANDLING TO SEE BODY
            // CURRENTLY BLIND  
            this.handleBlindTunnel(req, clientSocket as net.Socket, head);
        });
        this.server.listen(this.port, () => {
            this.isRunning = true;
            console.log(`Proxy server is running on port ${this.port}`);
        });

    }

    public stop() {
        if (this.isRunning) {
            this.server.close();
            this.isRunning = false;
            console.log('Proxy server has been stopped');
        }
    }



    private handleBlindTunnel(req: http.IncomingMessage, clientSocket: net.Socket, head: Buffer) {
        const { port, hostname } = new URL(`http://${req.url}`);
        const serverSocket = net.connect(Number(port) || 443, hostname, () => {
            clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                'Proxy-agent: VSCodeInterceptor\r\n' +
                '\r\n');
            serverSocket.write(head);
            serverSocket.pipe(clientSocket);
            clientSocket.pipe(serverSocket);
        });

        serverSocket.on('error', (err) => {
            console.error('Tunnel Error:', err);
            clientSocket.end();
        });
    }



    private handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        const options = {
            hostname: req.headers.host?.split(':')[0],
            port: req.headers.host?.split(':')[1] || 80,
        };
    }
}