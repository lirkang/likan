import * as vscode from 'vscode'

const htmlWrap = vscode.commands.registerCommand('likan.htmlWrap', data => {
  const activeTextEditor = vscode.window.activeTextEditor
  const activeDocument = activeTextEditor?.document
  const selection = activeTextEditor?.selection

  if (!selection || !activeDocument) return

  if (selection.isEmpty) return

  const selectText = `<$1>\n${activeDocument.getText(selection)}\n</$1>`

  activeTextEditor.insertSnippet(new vscode.SnippetString(selectText))
})

export { htmlWrap }
