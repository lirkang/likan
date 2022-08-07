import { exec } from 'child_process'
import * as vscode from 'vscode'

function openBrowser() {
  const filename = vscode.window.activeTextEditor?.document.fileName

  if (!filename) return

  exec(`start file://${filename}`)
}

export { openBrowser }
