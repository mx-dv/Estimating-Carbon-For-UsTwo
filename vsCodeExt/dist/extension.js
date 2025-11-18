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

// src/budget.ts
var calls = [];
var storeKey = "storeKey";
var callStore;
async function resetBudget() {
  await callStore.update(storeKey, void 0);
}
function initStorage(memento) {
  callStore = memento;
}
function updateLimit() {
  calls = callStore.get(storeKey, []) || [];
  calls.sort((a, b) => a - b);
  console.log(calls);
  var mid = calls.length / 2;
  if (calls.length === 0) {
    return 0;
  } else if (calls.length % 2 === 0) {
    return (calls[mid] + calls[mid - 1]) / 2;
  } else {
    return calls[Math.floor(mid)];
  }
}
function storeCall(newCall) {
  calls = callStore.get(storeKey, []) || [];
  calls.push(newCall.Emissions);
  callStore.update(storeKey, calls);
}

// src/extension.ts
function activate(context) {
  var barManager = new statusBarManager();
  const treeDataProvider = new MyTreeDataProvider();
  vscode.window.registerTreeDataProvider(
    "myPrimaryView",
    treeDataProvider
  );
  initStorage(context.workspaceState);
  console.log('Congratulations, your extension "vsCodeExt" is now active!');
  const disposable = vscode.commands.registerCommand("vsCodeExt.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from EstimatingCarbon!");
  });
  const reset = vscode.commands.registerCommand("vsCodeExt.clearStore", () => {
    resetBudget();
    vscode.window.showInformationMessage("Past calls cleared.");
  });
  const input = vscode.commands.registerCommand("vsCodeExt.inputdisplay", async () => {
    const limit = await vscode.window.showInputBox({
      //opens an input box currently representing the carbon footprint
      prompt: "Enter test call: ",
      placeHolder: "eg. 5",
      ignoreFocusOut: true
      // keep input box open even if focus moves away from window
    });
    var num = Number(limit);
    var newCall = { Emissions: num };
    storeCall(newCall);
    var cLimit = updateLimit();
    console.log("limit: " + cLimit);
    barManager.updateBar(num, cLimit);
    treeDataProvider.addMessage("Call ID: xxxx - Emissions: " + num + " g CO\u2082e");
  });
  context.subscriptions.push(input);
  context.subscriptions.push(disposable);
}
function deactivate() {
}
var MyTreeDataProvider = class {
  _onDidChangeTreeData = new vscode.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  items = [];
  //creates a list of tree items starts empty obviously
  constructor() {
    this.items.push(new vscode.TreeItem(
      "Latest calls:",
      vscode.TreeItemCollapsibleState.None
    ));
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.items);
    }
  }
  addMessage(message) {
    this.items.push(new vscode.TreeItem(
      //adds a new item to the side bar
      message,
      vscode.TreeItemCollapsibleState.None
    ));
    this._onDidChangeTreeData.fire();
  }
};
var statusBarManager = class {
  mainItem = vscode.window.createStatusBarItem();
  //creates a status bar item for limit word
  loading = [];
  //creates a list of statusbar items for the loading bar items
  defaultColour = "statusBarItem.activeBackground";
  newColour;
  constructor() {
    this.newColour = this.defaultColour;
    this.mainItem.text = "Average carbon cost: g CO\u2082e";
    this.mainItem.show();
  }
  updateBar(input, limit) {
    if (input) {
      this.mainItem.text = "Average carbon cost: " + limit + " g CO\u2082e";
      if (input >= limit) {
        this.newColour = "statusBarItem.errorBackground";
        vscode.window.showInformationMessage("High carbon AI call made (check pane for details)");
      } else {
        this.newColour = "statusBarItem.warningBackground";
        vscode.window.showInformationMessage("below limit");
      }
      var i = 0;
    } else {
      this.newColour = "statusBarItem.activeBackground";
      input = 0;
      vscode.window.showInformationMessage("not satisfied!");
    }
    this.mainItem.backgroundColor = new vscode.ThemeColor(this.newColour);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
