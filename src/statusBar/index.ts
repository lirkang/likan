import { statSync } from 'fs'
import * as os from 'os'
import * as vscode from 'vscode'
import formatSize from '../utils/formatSize'
import fileSize from './file-size'
import mem from './mem'
import { npmSelect, npmStart } from './npm'
import terminal from './terminal'

fileSize.show()
mem.show()
terminal.show()
npmSelect.show()
npmStart.show()

setInterval(() => {
  mem.text = `$(plug) ${formatSize(os.totalmem() - os.freemem(), false)} / ${formatSize(os.totalmem())}`

  mem.show()
}, 5000)

function updateConfig() {
  const filename = vscode.window.activeTextEditor?.document.fileName

  if (filename) {
    fileSize.text = `$(file-binary) ${formatSize(statSync(filename).size)}`
    fileSize.show()
  } else fileSize.hide()
}

vscode.window.onDidChangeActiveTextEditor(updateConfig)
vscode.workspace.onDidChangeConfiguration(updateConfig)
vscode.workspace.onDidSaveTextDocument(updateConfig)
