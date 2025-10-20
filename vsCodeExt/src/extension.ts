// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsCodeExt" is now active!');


	const disposableAPIKEY = vscode.commands.registerCommand('vsCodeExt.setApiKey', async () => {
		const apiKey = await vscode.window.showInputBox({
			prompt: 'Enter your API Key',
			placeHolder: 'e.g.   sk - xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			ignoreFocusOut: true // keep input box open even if focus moves away from window

		});
		if (apiKey){
			await context.secrets.store('myApiKey', apiKey); // securely stores apikey using key 'myApiKey'
			
			// to retrieve key from secret store, use:   const apiKey = await context.secrets.get('myApiKey');

			vscode.window.showInformationMessage('API Key successfully set!');
		}
		else {
            vscode.window.showWarningMessage('API Key setting cancelled.');
		}
	});

	context.subscriptions.push(disposableAPIKEY);


	//------------     CREATE A PROXY SERVER TO ACT AS AN INBETWEEN FOR THE API RESPONSES

	//1: Define target for request to be forwarded to

	//2: instantiate the proxy client

	//3: create a standard node.js jttp server. This should then listen for incoming requests

	//4: choose localhost port

	//5: Store port in "context.globalState" so other areas of the extension can access it

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vsCodeExt.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from EstimatingCarbon!');
	});

	context.subscriptions.push(disposable); 
}

// This method is called when your extension is deactivated
export function deactivate() {}
