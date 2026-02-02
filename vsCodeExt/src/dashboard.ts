import * as vscode from 'vscode';

export class CarbonDashboardPanel {
    public static currentPanel: CarbonDashboardPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private readonly _extensionUri: vscode.Uri;


    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent();
    }

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // already have a panel
        if (CarbonDashboardPanel.currentPanel) {
            CarbonDashboardPanel.currentPanel._panel.reveal(column);
            return;
        }

        // create a new panel
        const panel = vscode.window.createWebviewPanel(
            'carbonDashboard',
            'Carbon Dashboard',
            column || vscode.ViewColumn.One,
            { enableScripts: true }
        );

        CarbonDashboardPanel.currentPanel = new CarbonDashboardPanel(panel, extensionUri);
    }

    public dispose() {
        CarbonDashboardPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) { x.dispose(); }
        }
    }

    private _getWebviewContent() {
      const webview = this._panel.webview;
      const styleUri = webview.asWebviewUri(
    vscode.Uri.file(`${this._extensionUri.fsPath}/src/webview/style.css`)
);
const scriptUri = webview.asWebviewUri(
    vscode.Uri.file(`${this._extensionUri.fsPath}/src/webview/darkmode.js`)
);

        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Carbon Dashboard</title>
<style>

/* day mode color setting */

:root{
   --base-color: white;
  --base-variant: #e8e9ed;
  --text-color: #111528;
  --secondary-text: #232738;
  --primary-color: #3a435d;
}

/* night mode color setting */

body.darkmode{
    --base-color:#070b1d;
    --base-variant:#03050e;
    --text-color:#ffffff;
    --secondary-text: #a4a5b8;
    --primary-color: #3a435d;
}

/* basic browser setting, and font */

* { margin:0; padding:0; box-sizing:border-box; }
html{ font-family: sans-serif; }

/* main pag style, paddings  */

body{ min-height:100vh; background-color:var(--base-color); color:var(--text-color); transition: all 0.3s ease; }
header, section{ padding:70px min(50px,7%); }
section{ background-color: var(--base-variant); }
p{ margin:10px 0 20px 0; color:var(--secondary-text); }

/* the circle outside icon */

#theme-switch{
    height: 50px;
    width: 50px;
    padding: 0;
    border-radius: 50%;
    background-color: var(--base-variant);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 20px;
    right: 20px;
    cursor: pointer;
}

/* hide icon at relevent mode */

#theme-switch svg{ fill: var(--primary-color); }
#theme-switch svg:last-child{ display: none; }
body.darkmode #theme-switch svg:first-child{ display: none; }
body.darkmode #theme-switch svg:last-child{ display: block; }
</style>
</head>
<body>
<header>

<!-- icon picture link -->

  <button id="theme-switch">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/></svg>
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/></svg>
  </button>
  <h1>chart 1</h1>
  <p> something here</p>
</header>
<section>
  <h2>chart 2</h2>
  <p>something here</p>
</section>
<script>

// listens for clicking and change color for it

  const btn = document.getElementById('theme-switch');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('darkmode');
  });
</script>
</body>
</html>`;
    }
}