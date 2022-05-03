import * as vscode from 'vscode'

function terminal() {
  const { terminals } = vscode.window

  if (!terminals.length) vscode.window.createTerminal().show()
  else vscode.window.terminals[vscode.window.terminals.length - 1].show()

  vscode.window.activeTerminal?.hide()
}

export { terminal }
