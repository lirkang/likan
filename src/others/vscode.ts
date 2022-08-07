/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { existsSync, readFileSync } from 'fs'
import { dirname, extname, resolve } from 'path'
import {
  CompletionItemKind,
  CompletionList,
  languages,
  Location,
  Position,
  SnippetString,
  Uri,
  window,
  workspace
} from 'vscode'
import { npmStart } from './status-bar'

const snippets = require('~/public/snippets.json')

window.onDidCloseTerminal(e => {
  if (!window.terminals.length) {
    npmStart.text = '$(run)'
  }
})

workspace.onDidSaveTextDocument(document => {
  const text = readFileSync(document.fileName).toString()

  if (!text.trim().length) {
    const suffix = extname(document.fileName)

    const whitelist: string[] = ['.ts', '.tsx', '.js', '.jsx']

    if (whitelist.includes(suffix)) {
      window.activeTextEditor?.insertSnippet(
        new SnippetString(snippets['doc-comment']['body'].join('\n')),
        new Position(0, 0)
      )
    }
  }
})

languages.registerDefinitionProvider(
  { language: 'json', pattern: '**/package.json' },
  {
    provideDefinition(document, position, token) {
      const word = document.getText(document.getWordRangeAtPosition(position, /"[\.@/\-\d\w]*"/g)).replace(/"/g, '')

      const workspace = dirname(document.fileName)

      const targetDir = resolve(workspace, 'node_modules/', word, 'package.json')

      if (existsSync(targetDir)) {
        return new Location(Uri.file(targetDir), new Position(0, 0))
      }
    }
  }
)

languages.setLanguageConfiguration('json', {
  wordPattern: /(\@?[\.\-a-zA-Z]*(\/)?[\.\-0-9a-zA-Z]+)/g
})

languages.registerCompletionItemProvider(
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
        const env = readEnvs(window.activeTextEditor!.document.fileName.replace(/src.*/g, ''))

        return new CompletionList(
          env.map(({ key, value, path }) => ({
            label: key,
            detail: value,
            kind: CompletionItemKind.Value,
            documentation: path
          }))
        )
      }
    }
  },
  '.'
)

// languages.registerCompletionItemProvider(
//   ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
//   {
//     provideCompletionItems(document, position, token, context) {
//       return new CompletionList([{ label: '123', detail: '123' }])
//     }
//   },
//   '*'
// )

// languages.registerDefinitionProvider(['javascript', 'typescript', 'javascriptreact', 'typescriptreact'], {
//   provideDefinition(document, position, token) {
//     const word = document
//       .getText(document.getWordRangeAtPosition(position, /\@?[\:\\\/\.a-zA-Z0-9]+/))
//       .replace(/'/g, '')

//     return new Location(Uri.file(resolve(document.fileName, '..', word)), new Position(0, 0))
//   }
// })
