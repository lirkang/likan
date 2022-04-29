import { statSync } from 'fs'
import * as os from 'os'
import * as vscode from 'vscode'
import comment from './comment'
import { htmlWrap } from './html-wrap'
import { npmSelect, npmStart } from './npm'
import openBrowser from './open-browser'
import { openInCurrentWindow, openInNewWindow } from './open-window'
import terminal from './terminal'
import { createStatusBarItem, formatSize } from './utils'

let timer: NodeJS.Timeout

export async function activate(context: vscode.ExtensionContext) {
  let memStatusBarItem: vscode.StatusBarItem | undefined = undefined

  const terminalStatusBarItem = createStatusBarItem(
    'likan.terminalToggle',
    '$(terminal)',
    '切换终端',
    vscode.StatusBarAlignment.Left,
    101
  )

  const settingsStatusBarItem = createStatusBarItem(
    'workbench.action.openSettingsJson',
    '$(preferences-open-settings)',
    '打开设置JSON',

    vscode.StatusBarAlignment.Right,
    -11
  )

  const filesizeStatusBarItem = createStatusBarItem(
    undefined,
    '',
    '文件大小',
    vscode.StatusBarAlignment.Left,
    -1
  )

  const gitCommitStatusBarItem = createStatusBarItem(
    'git.commit',
    '$(git-commit)',
    'Git - 提交',
    vscode.StatusBarAlignment.Left,
    102
  )

  function updateMem() {
    clearInterval(timer)
    if (!vscode.workspace.getConfiguration('likan').showMem) return

    timer = setInterval(() => {
      if (memStatusBarItem) memStatusBarItem.dispose()

      memStatusBarItem = createStatusBarItem(
        undefined,
        `$(pulse)  ${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)} %`,
        `内存占用 ${formatSize(os.totalmem() - os.freemem())} / ${formatSize(
          os.totalmem()
        )}`,
        vscode.StatusBarAlignment.Right,
        101
      )
      memStatusBarItem.show()
    }, 5000)
  }

  updateMem()

  terminalStatusBarItem.show()
  settingsStatusBarItem.show()
  gitCommitStatusBarItem.show()

  function updateConfig() {
    const { showFilesize, showMem, showTerminal, showCommit } =
      vscode.workspace.getConfiguration('likan')

    if (showFilesize) {
      const filename = vscode.window.activeTextEditor?.document.fileName

      if (filename) {
        filesizeStatusBarItem.show()

        return (filesizeStatusBarItem.text = formatSize(
          statSync(filename).size
        ))
      }
    } else {
      filesizeStatusBarItem.hide()
    }

    if (showMem) {
      updateMem()
    } else {
      clearInterval(timer)
      memStatusBarItem?.hide()
    }

    if (showTerminal) {
      terminalStatusBarItem.show()
    } else {
      terminalStatusBarItem.hide()
    }

    if (showCommit) {
      gitCommitStatusBarItem.show()
    } else {
      gitCommitStatusBarItem.hide()
    }
  }

  vscode.window.onDidChangeActiveTextEditor(updateConfig)
  vscode.workspace.onDidChangeConfiguration(updateConfig)
  vscode.workspace.onDidSaveTextDocument(updateConfig)

  context.subscriptions.push(
    terminal,
    openBrowser,
    npmSelect,
    npmStart,
    htmlWrap,
    openInNewWindow,
    openInCurrentWindow,
    comment
  )
}

export function deactivate() {
  clearInterval(timer)
}
