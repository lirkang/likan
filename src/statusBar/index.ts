import { statSync } from 'fs'
import * as os from 'os'
import * as vscode from 'vscode'
import formatSize from '../utils/formatSize'
import fileSize from './file-size'
import gitCommit from './git-commit'
import mem from './mem'
import settingJson from './setting-json'
import slider from './slider'
import terminal from './terminal'

fileSize.show()
mem.show()
terminal.show()
gitCommit.show()
settingJson.show()
slider.show()

let timer: NodeJS.Timeout

function updateMem() {
  timer = setInterval(() => {
    mem.text = `$(plug) ${((1 - os.freemem() / os.totalmem()) * 100).toFixed(
      2
    )} %`

    mem.tooltip = `内存占用 ${formatSize(
      os.totalmem() - os.freemem()
    )} / ${formatSize(os.totalmem())}`

    mem.show()
  }, 5000)
}

updateMem()

function updateConfig() {
  const { showFilesize, showMem, showTerminal, showCommit } =
    vscode.workspace.getConfiguration('likan')

  const filename = vscode.window.activeTextEditor?.document.fileName

  if (showFilesize && filename) {
    fileSize.text = `$(file-binary) ${formatSize(statSync(filename).size)}`
    fileSize.show()
  } else fileSize.hide()

  if (showMem) {
    // @ts-ignore
    if (timer._destroyed) updateMem()
  } else {
    clearInterval(timer)
    mem.hide()
  }

  if (showTerminal) terminal.show()
  else terminal.hide()

  if (showCommit) gitCommit.show()
  else gitCommit.hide()
}

vscode.window.onDidChangeActiveTextEditor(updateConfig)
vscode.workspace.onDidChangeConfiguration(updateConfig)
vscode.workspace.onDidSaveTextDocument(updateConfig)
