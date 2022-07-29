/**
 * @Author likan
 * @Date 2022-05-22 20:51:10
 * @FilePath D:\CodeSpace\Dev\extension\likan\src\command\comment.ts
 */

const dayjs = require('dayjs')
import { basename } from 'path'
import * as vscode from 'vscode'

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
