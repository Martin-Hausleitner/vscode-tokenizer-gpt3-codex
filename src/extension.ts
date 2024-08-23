import * as vscode from "vscode";
import { encoding_for_model, TiktokenModel} from "tiktoken";

const validModels = [
  "davinci-002",
    "babbage-002",
    "text-davinci-003",
    "text-davinci-002",
    "text-davinci-001",
    "text-curie-001",
    "text-babbage-001",
    "text-ada-001",
    "davinci",
    "curie",
    "babbage",
    "ada",
    "code-davinci-002",
    "code-davinci-001",
    "code-cushman-002",
    "code-cushman-001",
    "davinci-codex",
    "cushman-codex",
    "text-davinci-edit-001",
    "code-davinci-edit-001",
    "text-embedding-ada-002",
    "text-similarity-davinci-001",
    "text-similarity-curie-001",
    "text-similarity-babbage-001",
    "text-similarity-ada-001",
    "text-search-davinci-doc-001",
    "text-search-curie-doc-001",
    "text-search-babbage-doc-001",
    "text-search-ada-doc-001",
    "code-search-babbage-code-001",
    "code-search-ada-code-001",
    "gpt2",
    "gpt-3.5-turbo",
    "gpt-35-turbo",
    "gpt-3.5-turbo-0301",
    "gpt-3.5-turbo-0613",
    "gpt-3.5-turbo-1106",
    "gpt-3.5-turbo-0125",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-16k-0613",
    "gpt-3.5-turbo-instruct",
    "gpt-3.5-turbo-instruct-0914",
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-0613",
    "gpt-4-32k",
    "gpt-4-32k-0314",
    "gpt-4-32k-0613",
    "gpt-4-turbo",
    "gpt-4-turbo-2024-04-09",
    "gpt-4-turbo-preview",
    "gpt-4-1106-preview",
    "gpt-4-0125-preview",
    "gpt-4-vision-preview",
    "gpt-4o",
    "gpt-4o-2024-05-13"
]

export function activate(context: vscode.ExtensionContext) {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBar);
  statusBar.command = "vscode-tokenizer-gpt3-codex.changeTokenizerType"; // Füge Command zum Statusbar-Item hinzu

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
        const type = await vscode.window.showQuickPick(validModels);
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
        const currentType = config.get<TiktokenModel>("type") || "gpt-4";
        const newType = currentType === "gpt-4" ? "gpt-3.5-turbo" : "gpt-4";
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
    var type = config.get<TiktokenModel>("type") || "gpt-4";
    // check if type is valid
    if (!validModels.includes(type)) {
      type = "gpt-4";
    }
    const encoder = encoding_for_model(type)
    const tokens = encoder.encode(content);
    statusBar.text = `${tokens.length} Tokens (${type})`;
    encoder.free();
    statusBar.show();
  }
}

export function deactivate() {}
