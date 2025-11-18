"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// src/proxyServer.ts
var http = __toESM(require("http"));
var net = __toESM(require("net"));
var import_url = require("url");
var InterceptorProxy = class {
  server;
  port;
  isRunning = false;
  constructor(port) {
    this.port = port;
    this.server = http.createServer();
  }
  start() {
    this.server.on("request", (req, res) => {
      console.log("[HTTP] Intercepted: ${req.url}");
      this.handleHttpRequest(req, res);
    });
    this.server.on("connect", (req, clientSocket, head) => {
      console.log("[HTTPS] Intercepted: ${req.url}");
      this.handleBlindTunnel(req, clientSocket, head);
    });
    this.server.listen(this.port, () => {
      this.isRunning = true;
      console.log(`Proxy server is running on port ${this.port}`);
    });
  }
  stop() {
    if (this.isRunning) {
      this.server.close();
      this.isRunning = false;
      console.log("Proxy server has been stopped");
    }
  }
  handleBlindTunnel(req, clientSocket, head) {
    const { port, hostname } = new import_url.URL(`http://${req.url}`);
    const serverSocket = net.connect(Number(port) || 443, hostname, () => {
      clientSocket.write("HTTP/1.1 200 Connection Established\r\nProxy-agent: VSCodeInterceptor\r\n\r\n");
      serverSocket.write(head);
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });
    serverSocket.on("error", (err) => {
      console.error("Tunnel Error:", err);
      clientSocket.end();
    });
  }
  handleHttpRequest(req, res) {
    const options = {
      hostname: req.headers.host?.split(":")[0],
      port: req.headers.host?.split(":")[1] || 80
    };
  }
};

// src/extension.ts
var proxyServer;
var PROXY_PORT = 3024;
function activate(context) {
  console.log("Interceptor Proxy Server is active");
  let startDisposable = vscode.commands.registerCommand("interceptor.start", async () => {
    try {
      proxyServer = new InterceptorProxy(PROXY_PORT);
      proxyServer.start();
      const config = vscode.workspace.getConfiguration("http");
      await config.update("proxy", `http://localhost:${PROXY_PORT}`, vscode.ConfigurationTarget.Global);
      await config.update("proxyStrictSSL", false, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage("Interceptor Proxy started on port " + PROXY_PORT);
    } catch (error) {
      vscode.window.showErrorMessage("Failed to start Interceptor Proxy: " + error);
    }
  });
  let stopDisposable = vscode.commands.registerCommand("interceptor.stop", async () => {
    if (proxyServer) {
      proxyServer.stop();
    }
    const config = vscode.workspace.getConfiguration("http");
    await config.update("proxy", void 0, vscode.ConfigurationTarget.Global);
    await config.update("proxyStrictSSL", void 0, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage("Interceptor Proxy stopped. Proxy settings cleared.");
  });
  context.subscriptions.push(startDisposable);
  context.subscriptions.push(stopDisposable);
}
async function deactivate() {
  if (proxyServer) {
    await proxyServer.stop();
  }
  const config = vscode.workspace.getConfiguration("http");
  await config.update("proxy", void 0, vscode.ConfigurationTarget.Global);
  await config.update("proxyStrictSSL", void 0, vscode.ConfigurationTarget.Global);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
