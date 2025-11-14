// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { stringify } from 'querystring';
import * as vscode from 'vscode';
import * as https from 'https';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const BarManager = vscode.window.createStatusBarItem();
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


	//1. Wait and listen for an API call to be made to gemini / openAI

	//2. Determine model used by looking at API call

	//3. Send usage request to correct API usage endpoint using correct API key

	//4. Find Tokens and calculate costs
	function calculateEmission(model: string,token: number,carbon: number){
		const chatgpt4oshort = 0.000000370125;
		const chatgpt4omedium = 0.000000212625; 
		const chatgpt4olong = 0.0000000875;  
		const chatgpt4ominishort =  0.00923;
		const chatgpt4ominimedium = 0.00369;
		const chatgpt4ominilong = 0.0006293 ;
		const chatgpt4point5 = 0.0003;

		if (model === "gpt-4o"){
			if ( token<=400 ){
				carbon = chatgpt4oshort * token
			}else if(token<=2000) {
carbon = chatgpt4omedium * token
			}else if (token >= 11500){
				carbon = chatgpt4olong * token
			}
		} else if (model === "gpt-4o-mini"){
			if(token<=400){
				carbon = chatgpt4ominishort * token
			}else if(token <= 2000){
carbon = chatgpt4ominimedium * token 
			}else if(token <= 11500){
         carbon = chatgpt4ominilong * token
			}
		}else if (model ==="gpt-4.5"){
			carbon = chatgpt4point5 * token
		}
	return carbon
	}




	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vsCodeExt.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		vscode.window.showInformationMessage('Hello World from EstimatingCarbon!');
		
	});

	const input = vscode.commands.registerCommand('vsCodeExt.inputdisplay',()=> {
		
		vscode.window.showInputBox()!;
		
		var x = vscode.window.createStatusBarItem("testing",1,1);
		x.show();
	});

	context.subscriptions.push(disposable); 
}

// This method is called when your extension is deactivated
export function deactivate() {}
