import * as vscode from 'vscode'

const snippets = require('../../snippets.json')

export default function insertComment() {
  vscode.window.activeTextEditor?.insertSnippet(
    new vscode.SnippetString(snippets['doc-comment']['body'].join('\n')),
    new vscode.Position(0, 0)
  )
}
