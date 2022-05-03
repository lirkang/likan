import * as vscode from 'vscode'
const opn = require('opn')

function openBrowser({ path }: { path: string }) {
  opn('file://' + path, { app: '' }).catch(() => {
    vscode.window.showErrorMessage('打开失败')
  })
}

export { openBrowser }
