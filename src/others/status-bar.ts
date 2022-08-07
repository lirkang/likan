import { statSync } from 'fs'
import * as os from 'os'
import * as vscode from 'vscode'
import formatSize from '../utils/formatSize'

type StatusBarAlignment = 'left' | 'right'

const alignment: { [key in StatusBarAlignment]: vscode.StatusBarAlignment } = {
  left: vscode.StatusBarAlignment.Left,
  right: vscode.StatusBarAlignment.Right
}

function create(
  id: string,
  command: string | undefined,
  text: string,
  tooltip: string,
  align: StatusBarAlignment,
  priority = 0
) {
  const statusBarItem = vscode.window.createStatusBarItem(id, alignment[align], priority)

  statusBarItem.command = command
  statusBarItem.text = text
  statusBarItem.tooltip = tooltip

  return statusBarItem
}

export const fileSize = create('likan-file-size', undefined, '', '', 'right', 101)
export const mem = create('likan-mem', undefined, '', '', 'right', 102)
export const npmStart = create('likan', 'likan.npmStart', '$(run)', '', 'left', 105)
export const npmSelect = create('likan', 'likan.npmSelect', '$(list-selection)', '', 'left', 104)
export const terminal = create('likan-terminal', 'likan.terminalToggle', 'Terminal', '', 'left', 103)

fileSize.show()
mem.show()
terminal.show()
npmSelect.show()
npmStart.show()

setInterval(() => {
  mem.text = `${formatSize(os.totalmem() - os.freemem(), false)} / ${formatSize(os.totalmem())}`

  mem.show()
}, 5000)

function updateConfig() {
  const filename = vscode.window.activeTextEditor?.document.fileName

  if (filename) {
    fileSize.text = `$(file-code) ${formatSize(statSync(filename).size)}`
    fileSize.show()
  } else fileSize.hide()
}

vscode.window.onDidChangeActiveTextEditor(updateConfig)
vscode.workspace.onDidSaveTextDocument(updateConfig)
