import { Position, SnippetString, window } from 'vscode'

const snippets = require('~/public/snippets.json')

export default function insertComment() {
  window.activeTextEditor?.insertSnippet(
    new SnippetString(snippets['doc-comment']['body'].join('\n')),
    new Position(0, 0)
  )
}
