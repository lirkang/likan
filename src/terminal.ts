import * as vscode from 'vscode'

const terminal = vscode.commands.registerCommand(
  'likan.terminalToggle',
  async () => {
    const { terminals } = vscode.window

    if (!terminals.length) vscode.window.createTerminal().show()
    else vscode.window.terminals[vscode.window.terminals.length - 1].show()

    vscode.window.activeTerminal?.hide()
  }
)

export default terminal
