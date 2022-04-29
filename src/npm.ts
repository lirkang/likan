import * as vscode from 'vscode'
import { runScript } from './utils'

const npmSelect = vscode.commands.registerCommand(
  'likan.npmSelect',
  async () => runScript(vscode.workspace.workspaceFolders![0].uri.fsPath, true)
)

const npmStart = vscode.commands.registerCommand(
  'likan.npmStart',
  async () => {
    const { npmStart } = vscode.workspace.getConfiguration('likan')

    runScript(vscode.workspace.workspaceFolders![0].uri.fsPath, true, npmStart)
  }
)

export { npmStart, npmSelect }
