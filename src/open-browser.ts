import * as vscode from 'vscode'
const opn = require('opn')

const openBrowser = vscode.commands.registerCommand(
  'likan.openInBrowser',
  ({ path }) => {
    opn('file://' + path, { app: '' }).catch(() => {
      vscode.window.showErrorMessage('打开失败')
    })
  }
)

export default openBrowser
