import * as vscode from 'vscode'

async function openInNewWindow(event: any) {
  const folderPath = event._fsPath ?? event.path

  await vscode.commands.executeCommand(
    'vscode.openFolder',
    vscode.Uri.file(folderPath),
    true
  )
}

async function openInCurrentWindow(event: any) {
  const folderPath = event._fsPath ?? event.path

  await vscode.commands.executeCommand(
    'vscode.openFolder',
    vscode.Uri.file(folderPath),
    false
  )
}

export { openInNewWindow, openInCurrentWindow }
