import * as vscode from 'vscode'

const openInNewWindow = vscode.commands.registerCommand(
  'likan.openInNewWindow',
  async event => {
    const folderPath = event._fsPath

    await vscode.commands.executeCommand(
      'vscode.openFolder',
      vscode.Uri.file(folderPath),
      true
    )
  }
)

const openInCurrentWindow = vscode.commands.registerCommand(
  'likan.openInCurrentWindow',
  async event => {
    const folderPath = event._fsPath

    await vscode.commands.executeCommand(
      'vscode.openFolder',
      vscode.Uri.file(folderPath),
      false
    )
  }
)

export { openInNewWindow, openInCurrentWindow }
