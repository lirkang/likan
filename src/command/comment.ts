/**
 * @Author likan
 * @Date 2022-05-22 20:51:10
 * @FilePath D:\CodeSpace\Dev\extension\likan\src\command\comment.ts
 */

const dayjs = require('dayjs')
import { basename } from 'path'
import * as vscode from 'vscode'

function comment() {
  return vscode.window.activeTextEditor?.insertSnippet(
    new vscode.SnippetString(`/**
 * @Author likan
 * @Date $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE $CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND
 * @FilePath $TM_FILEPATH
 */\n\n`),
    new vscode.Position(0, 0)
  )
}

vscode.workspace.onDidCreateFiles(({ files }) => {
  const suffix = basename(files[0].fsPath).split('.').pop()

  const whitelist: string[] = ['ts', 'tsx', 'js', 'jsx']

  if (whitelist.includes(suffix!)) {
    const workspaceEdit = new vscode.WorkspaceEdit()

    workspaceEdit.insert(
      files[0],
      new vscode.Position(0, 0),
      `/**
 * @Author likan
 * @Date ${dayjs().format('YYYY-MM-DD HH:mm:ss')}
 * @FilePath ${
   files[0].fsPath.slice(0, 1).toUpperCase() + files[0].fsPath.slice(1)
 }
 */\n\n`
    )

    vscode.workspace.applyEdit(workspaceEdit)
  }
})

export { comment }
