/**
 * @Author likan
 * @Date 2022-05-22 20:51:10
 * @FilePath D:\CodeSpace\Dev\extension\likan\src\command\comment.ts
 */

import { readFileSync } from 'fs'
import { extname } from 'path'
import * as vscode from 'vscode'

const snippets = require('../../snippets.json')

vscode.workspace.onDidSaveTextDocument(document => {
  const text = readFileSync(document.fileName).toString()

  if (!text.trim().length) {
    const suffix = extname(document.fileName)

    const whitelist: string[] = ['.ts', '.tsx', '.js', '.jsx']

    if (whitelist.includes(suffix)) {
      vscode.window.activeTextEditor?.insertSnippet(
        new vscode.SnippetString(snippets['doc-comment']['body'].join('\n')),
        new vscode.Position(0, 0)
      )
    }
  }
})

export default function insertComment() {
  const suffix = extname(vscode.window.activeTextEditor?.document.fileName!)

  const whitelist: string[] = ['.ts', '.tsx', '.js', '.jsx']

  if (whitelist.includes(suffix)) {
    vscode.window.activeTextEditor?.insertSnippet(
      new vscode.SnippetString(snippets['doc-comment']['body'].join('\n')),
      new vscode.Position(0, 0)
    )
  }
}
