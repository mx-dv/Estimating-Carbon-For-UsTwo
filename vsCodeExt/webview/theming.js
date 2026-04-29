import {
    provideVsCodeDesignSystem,
    vsCodeButton,
    vsCodeDropdown,
    vsCodeTextField,
    vsCodeOption,
    vsCodeCheckbox,
    vsCodeRadio,
    vsCodeBadge,
    vsCodeProgressRing,
    vsCodeSpinner,
} from "@vscode/webview-ui-toolkit";

provideVsCodeDesignSystem().register(
    vsCodeButton(),
    vsCodeDropdown(),
    vsCodeTextField(),
    vsCodeOption(),
    vsCodeCheckbox(),
    vsCodeRadio(),
    vsCodeBadge(),
    vsCodeProgressRing(),
    vsCodeSpinner()
);

window.addEventListener("load", () => {
    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            vscode.postMessage({ command: "triggerReset" });
        });
    }
});

// const resetBtn = document.getElementById('reset-btn');
    // if (resetBtn) {
    //     resetBtn.addEventListener('click', () => {
    //         // sending a message to extension.ts
    //         vscode.postMessage({ command: 'triggerReset' });
    //     });
    // }