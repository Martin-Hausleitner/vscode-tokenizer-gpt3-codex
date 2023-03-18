import * as vscode from "vscode";
import GPT3Tokenizer from "gpt3-tokenizer";

export function activate(context: vscode.ExtensionContext) {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBar);
  statusBar.command = "vscode-tokenizer-gpt3-codex.toggleTokenizerType"; // Füge Command zum Statusbar-Item hinzu

  let displayEnabled = true;
  updateStatusBarItem();

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-tokenizer-gpt3-codex.toggleTokenCount",
      () => {
        displayEnabled = !displayEnabled;
        updateStatusBarItem();
        vscode.window.showInformationMessage("🔄 Token count toggled!");
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-tokenizer-gpt3-codex.changeTokenizerType",
      async () => {
        const type = await vscode.window.showQuickPick(["gpt3", "codex"]);
        if (type) {
          const config = vscode.workspace.getConfiguration("openaiTokenizer");
          await config.update("type", type, vscode.ConfigurationTarget.Global);
          updateStatusBarItem();
          vscode.window.showInformationMessage(
            `🔀 Tokenizer type changed to ${type}!`
          );
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-tokenizer-gpt3-codex.toggleTokenizerType",
      async () => {
        const config = vscode.workspace.getConfiguration("openaiTokenizer");
        const currentType = config.get<"gpt3" | "codex">("type") || "gpt3";
        const newType = currentType === "gpt3" ? "codex" : "gpt3";
        await config.update("type", newType, vscode.ConfigurationTarget.Global);
        updateStatusBarItem();
        vscode.window.showInformationMessage(
          `🔄 Tokenizer type toggled to ${newType}!`
        );
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
    const selection = editor.selection;
    let content = "";

    if (!selection.isEmpty) {
      content = document.getText(selection);
    } else {
      content = document.getText();
    }

    const config = vscode.workspace.getConfiguration("openaiTokenizer");
    const type = config.get<"gpt3" | "codex">("type") || "gpt3";
    const tokenizer = new GPT3Tokenizer({ type });

    const encoded = tokenizer.encode(content);

    statusBar.text = `${encoded.bpe.length} Tokens (${type})`;
    statusBar.show();
  }
}

export function deactivate() {}
