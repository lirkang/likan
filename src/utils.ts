import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import * as vscode from 'vscode'
import { QuickPickItem } from 'vscode'

function formatSize(size: number) {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    const temp = size / 1024

    return temp.toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    const temp = size / (1024 * 1024)

    return temp.toFixed(2) + ' MB'
  } else {
    const temp = size / (1024 * 1024 * 1024)

    return temp.toFixed(2) + ' GB'
  }
}

function createStatusBarItem(
  command: string | undefined,
  text: string,
  tooltip: string,
  align: vscode.StatusBarAlignment,
  priority = 0
) {
  const statusBarItem = vscode.window.createStatusBarItem(align, priority)

  statusBarItem.command = command
  statusBarItem.text = text
  statusBarItem.tooltip = tooltip

  return statusBarItem
}

async function runScript(path: string, first = false, script = '') {
  if (!existsSync(join(path, '/package.json'))) {
    const dir = readdirSync(path).filter(filePath =>
      statSync(`${path}/${filePath}`).isDirectory()
    )

    const { showConfirm } = vscode.workspace.getConfiguration('likan')

    if (!dir.length)
      return vscode.window.showInformationMessage(
        '目录下没有可执行的命令且没有更多目录'
      )

    if (!first && showConfirm) {
      const answer = await vscode.window.showQuickPick(['yes', 'no'], {
        placeHolder: '没有找到可执行的脚本, 是否继续选择'
      })

      if (answer !== 'yes') return
    }

    const folderPath = await vscode.window.showQuickPick(dir, {
      placeHolder: '选择目录'
    })

    if (!folderPath) return

    runScript(join(path, folderPath), false, script)
  } else {
    if (!script) {
      const packageJson = readFileSync(join(path, '/package.json'), 'utf8')

      const { scripts } = JSON.parse(packageJson)

      if (!scripts || !Object.keys(scripts).length) return

      const quickPick = Object.keys(scripts).map((item: string) => ({
        label: item,
        description: scripts[item]
      }))

      const pickScript = await vscode.window.showQuickPick(quickPick, {
        placeHolder: '选择需要执行的脚本'
      })

      if (!pickScript) return

      script = pickScript.label
    }

    const terminal = vscode.window.createTerminal({ name: 'likan' })

    terminal.sendText(`cd ${path}`)
    terminal.sendText(`npm run ${script}`)
    terminal.show()
  }
}

export { formatSize, createStatusBarItem, runScript }
