import * as vscode from 'vscode'
import { CodelensProvider } from '../utils/CodelensProvider'

vscode.languages.registerCodeLensProvider(
  { language: 'json', pattern: '**/package.json' },
  new CodelensProvider(
    /\"dependencies\"\:\s?{[a-zA-Z\:\"\:\,\n\s\-\^\.0-9\@\/]*}/g,
    'dependencies',
    (key, value, index) => [
      {
        command: 'likan.installPackage',
        title: '$(cloud-download) 重新下载',
        arguments: [key, value],
        tooltip: '重新下载node包'
      },
      {
        command: 'likan.uninstallPackage',
        title: '$(notebook-delete-cell) 删除',
        arguments: [key, value],
        tooltip: '删除node包'
      },
      {
        command: 'likan.changePackageByVersion',
        title: '$(compare-changes) 切换版本',
        arguments: [key, value],
        tooltip: '切换node包版本'
      }
    ]
  )
)

vscode.languages.registerCodeLensProvider(
  { language: 'json', pattern: '**/package.json' },
  new CodelensProvider(
    /\"devDependencies\"\:\s?{[a-zA-Z\:\"\:\,\n\s\-\^\.0-9\@\/]*}/g,
    'devDependencies',
    (key, value, index) => [
      {
        command: 'likan.installPackage',
        title: '$(cloud-download) 重新下载',
        arguments: [key, value],
        tooltip: '下载node包'
      },
      {
        command: 'likan.uninstallPackage',
        title: '$(notebook-delete-cell) 删除',
        arguments: [key, value],
        tooltip: '删除node包'
      },
      {
        command: 'likan.changePackageByVersion',
        title: '$(compare-changes) 切换版本',
        arguments: [key, value],
        tooltip: `切换${key}包版本`
      }
    ]
  )
)

vscode.languages.registerCodeLensProvider(
  { language: 'json', pattern: '**/package.json' },
  new CodelensProvider(
    /"scripts":\s?{[a-zA-Z\:\"\:\,\n\s\-\\\&\.]*}/g,
    'scripts',
    (key, value, index) => [
      {
        command: 'likan.runScript',
        title: `$(run) 运行 npm run ${key}`,
        arguments: [key, value],
        tooltip: `运行 npm run ${key}`
      }
    ]
  )
)
