import { existsSync, readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import * as vscode from 'vscode'

vscode.languages.registerDefinitionProvider(
  { language: 'json', pattern: '**/package.json' },
  {
    provideDefinition(document, position, token) {
      const word = document.getText(document.getWordRangeAtPosition(position, /"[\.@/\-\d\w]*"/g)).replace(/"/g, '')

      const workspace = dirname(document.fileName)

      const targetDir = resolve(workspace, 'node_modules/', word, 'package.json')

      if (existsSync(targetDir)) {
        return [new vscode.Location(vscode.Uri.file(targetDir), new vscode.Position(0, 0))]
      }
    }
  }
)

vscode.languages.setLanguageConfiguration('json', {
  wordPattern: /"(\@?[\.\-a-zA-Z]*(\/)?[\.\-a-zA-Z]*)"/g
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
                      path: `${filepath}/${e}`
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
            documentation: `@Path ${path}`
          }))
        )
      }
    }
  },
  '.'
)

vscode.languages.registerInlineValuesProvider