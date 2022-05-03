import { existsSync, readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'
import * as vscode from 'vscode'

const NpmApi = require('npm-api')
const cmd = require('node-cmd')

async function selectScript(path: string, first = false, script = '') {
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

    selectScript(join(path, folderPath), false, script)
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

    runScript(`npm run ${script}`, path, 'likan,true')
  }
}

function runScript(script: string, path: string, name = 'likan', show = true) {
  const terminal = vscode.window.createTerminal({ name })

  terminal.sendText(`cd ${path}`)
  terminal.sendText(script)
  if (show) terminal.show()
}

function npmSelect() {
  return selectScript(vscode.workspace.workspaceFolders![0].uri.fsPath, true)
}

function npmStart() {
  const { npmStart } = vscode.workspace.getConfiguration('likan')

  selectScript(vscode.workspace.workspaceFolders![0].uri.fsPath, true, npmStart)
}

function installPackage(key: string, value: string) {
  runScript(
    `npm uninstall ${key} \n npm install ${key}`,
    join(vscode.window.activeTextEditor!.document.fileName, '..')
  )
}

function uninstallPackage(key: string, value: string) {
  runScript(
    `npm uninstall ${key}`,
    join(vscode.window.activeTextEditor!.document.fileName, '..')
  )
}

function changePackageByVersion(key: string, value: string) {
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
      title: '正在获取npm包版本'
    },
    () =>
      new Promise<void>(resolve => {
        cmd.run(
          `npm view ${key} versions --json`,
          async (err, data, stderr) => {
            resolve()

            if (err) return vscode.window.showErrorMessage('获取包版本失败')

            const version = await vscode.window.showQuickPick(
              JSON.parse(data).reverse(),
              {
                placeHolder: `选择要下载的版本 - ${key} - 当前版本 ${value}`,
                ignoreFocusOut: true,
                title: '按 Enter 选择, 按 ESC 退出'
              }
            )

            if (!version) return

            runScript(
              `npm install ${key}@${version}`,
              join(vscode.window.activeTextEditor!.document.fileName, '..')
            )
          }
        )
      })
  )
}

function npmRun(key: string, value: string) {
  runScript(
    `npm run ${key}`,
    join(vscode.window.activeTextEditor!.document.fileName, '..')
  )
}

export {
  installPackage,
  uninstallPackage,
  changePackageByVersion,
  npmStart,
  npmSelect,
  runScript,
  npmRun
}
