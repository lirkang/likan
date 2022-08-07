/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { existsSync, readFileSync } from 'fs'
import { dirname, extname, resolve } from 'path'
import * as vscode from 'vscode'
import { npmStart } from './status-bar'

const snippets = require('../../snippets.json')

vscode.window.onDidCloseTerminal(e => {
  if (!vscode.window.terminals.length) {
    npmStart.text = '$(run)'
  }
})

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

vscode.languages.registerDefinitionProvider(
  { language: 'json', pattern: '**/package.json' },
  {
    provideDefinition(document, position, token) {
      const word = document.getText(document.getWordRangeAtPosition(position, /"[\.@/\-\d\w]*"/g)).replace(/"/g, '')

      const workspace = dirname(document.fileName)

      const targetDir = resolve(workspace, 'node_modules/', word, 'package.json')

      if (existsSync(targetDir)) {
        return new vscode.Location(vscode.Uri.file(targetDir), new vscode.Position(0, 0))
      }
    }
  }
)

vscode.languages.setLanguageConfiguration('json', {
  wordPattern: /(\@?[\.\-a-zA-Z]*(\/)?[\.\-0-9a-zA-Z]+)/g
})

vscode.languages.registerCompletionItemProvider(
  ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
  {
    provideCompletionItems(document, position, token, context) {
      type Data = Record<'key' | 'value' | 'path', string>

      const envs = [
        '.env',
        '.env.local',
        '.env.development',
        '.env.production',
        '.env.development.local',
        '.env.production.local'
      ]

      function readEnvs(path: string): Array<Data> {
        let tempData: Array<Data> = []

        envs.forEach(e => {
          const filepath = resolve(path, e)

          if (existsSync(filepath)) {
            const fileData = readFileSync(filepath).toString()

            if (fileData.trim()) {
              const item = fileData
                .split('\n')
                .map(s => {
                  const indexof = s.indexOf('=')

                  if (indexof === -1) return false
                  else
                    return {
                      key: s.slice(0, indexof).trim(),
                      value: s.slice(indexof + 1, s.length).trim(),
                      path: e
                    }
                })
                .filter(i => i) as Array<Data>

              tempData.push(...item)
            }
          }
        })

        return tempData
      }

      const line = document.lineAt(position)

      if (line.text === 'process.env.') {
        const env = readEnvs(vscode.window.activeTextEditor!.document.fileName.replace(/src.*/g, ''))

        return new vscode.CompletionList(
          env.map(({ key, value, path }) => ({
            label: key,
            detail: value,
            kind: vscode.CompletionItemKind.Value,
            documentation: path
          }))
        )
      }
    }
  },
  '.'
)

// vscode.languages.registerCompletionItemProvider(
//   ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
//   {
//     provideCompletionItems(document, position, token, context) {
//       return new vscode.CompletionList([{ label: '123', detail: '123' }])
//     }
//   },
//   '*'
// )

// vscode.languages.registerDefinitionProvider(['javascript', 'typescript', 'javascriptreact', 'typescriptreact'], {
//   provideDefinition(document, position, token) {
//     const word = document
//       .getText(document.getWordRangeAtPosition(position, /\@?[\:\\\/\.a-zA-Z0-9]+/))
//       .replace(/'/g, '')

//     return new vscode.Location(vscode.Uri.file(resolve(document.fileName, '..', word)), new vscode.Position(0, 0))
//   }
// })
