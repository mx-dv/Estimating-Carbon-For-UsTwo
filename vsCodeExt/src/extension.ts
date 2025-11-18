import * as vscode from 'vscode';
import { InterceptorProxy } from './proxyServer';


let proxyServer: InterceptorProxy;
const PROXY_PORT = 3024;

export function activate(context: vscode.ExtensionContext) {
	console.log('Interceptor Proxy Server is active');

	let startDisposable = vscode.commands.registerCommand('interceptor.start', async () => {
		try {
			// start local server
			proxyServer = new InterceptorProxy(PROXY_PORT);
			proxyServer.start();

			// set VSCode to use local proxy
			const config = vscode.workspace.getConfiguration('http');
			await config.update('proxy', `http://localhost:${PROXY_PORT}`, vscode.ConfigurationTarget.Global)

			//QUICK FIX TO NOT NEED SSL CERTS FOR NOW
			await config.update('proxyStrictSSL', false, vscode.ConfigurationTarget.Global);

			vscode.window.showInformationMessage('Interceptor Proxy started on port ' + PROXY_PORT);
		} catch (error) {
			vscode.window.showErrorMessage('Failed to start Interceptor Proxy: ' + error);
		}
	});

	let stopDisposable = vscode.commands.registerCommand('interceptor.stop', async () => {
		// stop local server
		if (proxyServer) {
			proxyServer.stop();
		}

		// clear VSCode proxy settings
		const config = vscode.workspace.getConfiguration('http');
		await config.update('proxy', undefined, vscode.ConfigurationTarget.Global);
		await config.update('proxyStrictSSL', undefined, vscode.ConfigurationTarget.Global);

		vscode.window.showInformationMessage('Interceptor Proxy stopped. Proxy settings cleared.');
	});

	context.subscriptions.push(startDisposable);
	context.subscriptions.push(stopDisposable);
}


export async function deactivate() {
	// Make sure that the vscode isn't always vulnerable
	if (proxyServer) {
		await proxyServer.stop();
	}
	const config = vscode.workspace.getConfiguration('http');
	await config.update('proxy', undefined, vscode.ConfigurationTarget.Global);
	await config.update('proxyStrictSSL', undefined, vscode.ConfigurationTarget.Global);
}
