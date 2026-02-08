import * as vscode from 'vscode';

export function getLogFilePath(context: vscode.ExtensionContext) {
    return context.logUri.fsPath;
}

export function parseLogForCalls(rawLog: string) {
        
}
