Architecture

    listens to workspace.onDidChangeTextDocument
    using vscode.commands.onDidExecuteCommand 
        watches for inline suggestion accept commands  
            for example
                editor.action.inline

        pass the newly generated code into tiktokeniser 


Issues currently being faced
    intercepting the message and sending it to the model ourselves seems to breach ToS under privacy
    Copilot seems to keep the model used hidden and is unable to access
    Unable to access inline code generation which is not accepted as it is "Ghost text"

Possible solutions
    instead of making it model specific find a mean number of tokens by tokenising the message under multiple different models
