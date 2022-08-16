import open = require('open');

export default function openBrowser({ fsPath }: vscode.Uri) {
  open(fsPath);
}
