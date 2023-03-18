import * as vscode from "vscode";
import GPT3Tokenizer from "gpt3-tokenizer";

export function activate(context: vscode.ExtensionContext) {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBar);

  let displayEnabled = true;
  updateStatusBarItem();

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-openai-token-display.toggleTokenCount",
      () => {
        displayEnabled = !displayEnabled;
        updateStatusBarItem();
      }
    )
  );

  vscode.window.onDidChangeActiveTextEditor(
    updateStatusBarItem,
    null,
    context.subscriptions
  );
  vscode.window.onDidChangeTextEditorSelection(
    updateStatusBarItem,
    null,
    context.subscriptions
  );
  vscode.workspace.onDidChangeTextDocument(
    updateStatusBarItem,
    null,
    context.subscriptions
  );

  function updateStatusBarItem() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !displayEnabled) {
      statusBar.hide();
      return;
    }

    const document = editor.document;
    const content = document.getText();
    const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
    const encoded = tokenizer.encode(content);

    statusBar.text = `${encoded.bpe.length} Tokens`;
    statusBar.show();
  }
}

export function deactivate() {}
