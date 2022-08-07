import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import * as vscode from 'vscode'
import { npmStart as npmStartStatus } from '../statusBar/npm'

async function selectScript(path: string, first = false, script = '') {
  if (!existsSync(join(path, '/package.json'))) {
    const dir = readdirSync(path).filter(filePath => statSync(`${path}/${filePath}`).isDirectory())

    if (!dir.length) return vscode.window.showInformationMessage('目录下没有可执行的命令且没有更多目录')

    if (!first) {
      const answer = await vscode.window.showQuickPick(['yes', 'no'], {
        placeHolder: '没有找到可执行的脚本, 是否继续选择'
      })

      if (answer !== 'yes') return
    }

    const folderPath = await vscode.window.showQuickPick(dir, {
      placeHolder: '选择目录'
    })

    if (!folderPath) return

    selectScript(join(path, folderPath), false, script)
  } else {
    if (!script) {
      const packageJson = readFileSync(join(path, '/package.json'), 'utf8')

      const { scripts } = JSON.parse(packageJson)

      if (!scripts || !Object.keys(scripts).length) return

      const quickPick = Object.keys(scripts).map(key => ({
        label: key,
        detail: scripts[key] as string
      }))

      const pickScript = await vscode.window.showQuickPick(
        quickPick.filter(({ detail: { length } }) => length),
        { placeHolder: '选择需要执行的脚本', title: '已过滤空命令' }
      )

      if (!pickScript) return

      script = pickScript.label
    }

    const packManager = vscode.workspace.getConfiguration('likan').get('packManager')

    const scriptForCmd = packManager === 'yarn' ? `yarn ${script}` : `npm run ${script}`

    runScript(scriptForCmd, path, 'likan', true)
  }
}

function runScript(script: string, path: string, name: string, show = true) {
  const s = `${name}-${script}`

  const existTerminal = vscode.window.terminals.find(({ name: tName }) => tName === s)

  if (existTerminal) {
    existTerminal.dispose()
  }

  const terminal = vscode.window.createTerminal({ name: s })

  terminal.sendText(`cd ${path}`)
  terminal.sendText(script)

  npmStartStatus.text = '$(arrow-swap)'

  if (show) terminal.show()
}

function npmSelect() {
  const { workspaceFolders } = vscode.workspace

  if (!workspaceFolders?.length || !workspaceFolders[0]?.uri?.fsPath) return

  return selectScript(workspaceFolders[0].uri.fsPath, false)
}

function npmStart() {
  const { npmStart } = vscode.workspace.getConfiguration('likan')
  const { workspaceFolders } = vscode.workspace

  if (!workspaceFolders?.length || !workspaceFolders[0]?.uri?.fsPath) return

  selectScript(workspaceFolders[0].uri.fsPath, false, npmStart)
}

export { npmStart, npmSelect, runScript }
