import * as vscode from 'vscode'

function htmlWrap() {
  const activeTextEditor = vscode.window.activeTextEditor
  const activeDocument = activeTextEditor?.document
  const selection = activeTextEditor?.selection

  if (!selection || !activeDocument) return

  const selectText = `\n<$1>\n\t${activeDocument.getText(selection)}\n</>\n`

  activeTextEditor.insertSnippet(new vscode.SnippetString(selectText))
}

export { htmlWrap }
