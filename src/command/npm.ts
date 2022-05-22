import { existsSync, readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'
import * as vscode from 'vscode'

const moment = require('moment')
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
        detail: scripts[item]
      }))

      const pickScript = await vscode.window.showQuickPick(quickPick, {
        placeHolder: '选择需要执行的脚本'
      })

      if (!pickScript) return

      script = pickScript.label
    }

    const packManager = vscode.workspace
      .getConfiguration('likan')
      .get('packManager')

    const scriptForCmd =
      packManager === 'yarn' ? `yarn ${script}` : `npm run ${script}`

    runScript(scriptForCmd, path, 'likan', false)
  }
}

function runScript(
  script: string,
  path: string,
  name = 'likan',
  needInSame = true,
  show = true
) {
  const originTerminal = vscode.window.terminals.find(
    terminal => terminal.name === name
  )

  if (originTerminal && needInSame) {
    originTerminal.sendText(`cd ${path}`)
    originTerminal.sendText(script)
    if (show) originTerminal.show()
  } else {
    const terminal = vscode.window.createTerminal({ name })

    terminal.sendText(`cd ${path}`)
    terminal.sendText(script)
    if (show) terminal.show()
  }
}

function npmSelect() {
  const { workspaceFolders } = vscode.workspace

  if (!workspaceFolders?.length || !workspaceFolders[0]?.uri?.fsPath) return

  return selectScript(workspaceFolders[0].uri.fsPath, true)
}

function npmStart() {
  const { npmStart } = vscode.workspace.getConfiguration('likan')
  const { workspaceFolders } = vscode.workspace

  if (!workspaceFolders?.length || !workspaceFolders[0]?.uri?.fsPath) return

  selectScript(workspaceFolders[0].uri.fsPath, true, npmStart)
}

function installPackage(key: string, value: string, type: string) {
  if (!key) return

  const packManager = vscode.workspace
    .getConfiguration('likan')
    .get('packManager')

  const script =
    packManager === 'yarn'
      ? `yarn remove ${key} \n yarn add ${key}@${value} ${type}`
      : `npm uninstall ${key} \n npm install ${key}@${value} ${type}`

  runScript(
    script,
    join(vscode.window.activeTextEditor!.document.fileName, '..'),
    'likan-npm-installer'
  )
}

function uninstallPackage(key: string, value: string) {
  if (!key) return

  const packManager = vscode.workspace
    .getConfiguration('likan')
    .get('packManager')

  const script =
    packManager === 'yarn' ? `yarn remove ${key}` : `npm uninstall ${key}`

  runScript(
    script,
    join(vscode.window.activeTextEditor!.document.fileName, '..'),
    'likan-npm-installer'
  )
}

function changePackageByVersion(key: string, value: string, type: string) {
  if (!key) return

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      cancellable: true,
      title: '正在获取npm包版本'
    },
    () =>
      new Promise<void>(resolve => {
        cmd.run(
          `npm view ${key} time --json`,
          async (err: any, data: any, stderr: any) => {
            resolve()

            if (err) return vscode.window.showErrorMessage('获取包版本失败')

            data = JSON.parse(data)

            const versions: vscode.QuickPickItem[] = Object.keys(data).map(
              key => ({
                label: key,
                detail: moment(data[key]).format('YYYY-MM-DD HH:mm:ss')
              })
            )

            const version = await vscode.window.showQuickPick(
              versions.reverse(),
              {
                placeHolder: `选择要下载的版本 - ${key} - 当前版本 ${value}`
              }
            )

            if (!version) return

            const packManager = vscode.workspace
              .getConfiguration('likan')
              .get('packManager')

            const script =
              packManager === 'yarn'
                ? `yarn add ${key}@${version.label} ${type}`
                : `npm install ${key}@${version.label} ${type}`

            runScript(
              script,
              join(vscode.window.activeTextEditor!.document.fileName, '..'),
              'likan-npm-download'
            )
          }
        )
      })
  )
}

function npmRun(key: string, value: string) {
  const packManager = vscode.workspace
    .getConfiguration('likan')
    .get('packManager')

  const script = packManager === 'yarn' ? `yarn ${key}` : `npm run ${key}`

  runScript(
    script,
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
