/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { JAVASCRIPT_REGEXP, JSON_REGEXP } from '@/constants';
import { addExt, getRootPath, toFirstUpper } from '@/utils';
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, extname, resolve } from 'path';
import { CompletionItemKind, CompletionList, languages, Location, Position, Uri, workspace } from 'vscode';

workspace.onDidCreateFiles(({ files }) => {
  files.forEach(({ fsPath, path }) => {
    console.log(path);

    const suffix = extname(fsPath);

    const whitelist: string[] = ['.ts', '.tsx', '.js', '.jsx'];

    if (whitelist.includes(suffix) && !readFileSync(fsPath).toString().length) {
      writeFileSync(
        fsPath,
        `/**
 * @Author likan
 * @Date ${new Date().toLocaleString()}
 * @FilePath ${toFirstUpper(fsPath)}
 */\n\n`
      );
    }
  });
});

languages.registerDefinitionProvider(
  { language: 'json', pattern: '**/package.json' },
  {
    provideDefinition(document, position, token) {
      const word = document.getText(document.getWordRangeAtPosition(position));

      const workspace = dirname(document.fileName);

      const targetDir = resolve(workspace, 'node_modules/', word, 'package.json');

      if (existsSync(targetDir)) {
        return new Location(Uri.file(targetDir), new Position(0, 0));
      }
    },
  }
);

languages.setLanguageConfiguration('json', { wordPattern: JSON_REGEXP });

// languages.setLanguageConfiguration('typescript', { wordPattern: JAVASCRIPT_REGEXP });

// languages.setLanguageConfiguration('javascript', { wordPattern: JAVASCRIPT_REGEXP });

// languages.setLanguageConfiguration('typescriptreact', { wordPattern: JAVASCRIPT_REGEXP });

// languages.setLanguageConfiguration('javascriptreact', { wordPattern: JAVASCRIPT_REGEXP });

languages.registerCompletionItemProvider(
  ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
  {
    provideCompletionItems(document, position, token, context) {
      type Data = Record<'key' | 'value' | 'path', string>;

      const envs = [
        '.env',
        '.env.local',
        '.env.development',
        '.env.production',
        '.env.development.local',
        '.env.production.local',
      ];

      function readEnvs(path: string): Array<Data> {
        let tempData: Array<Data> = [];

        envs.forEach(e => {
          const filepath = resolve(path, e);

          if (existsSync(filepath)) {
            const fileData = readFileSync(filepath).toString();

            if (fileData.trim()) {
              const item = fileData
                .split('\n')
                .map(s => {
                  s = s.trim();

                  const indexof = s.indexOf('=');

                  if (indexof === -1) return false;
                  else
                    return {
                      key: s.slice(0, indexof).trim(),
                      value: s.slice(indexof + 1, s.length).trim(),
                      path: e,
                    };
                })
                .filter(i => i) as Array<Data>;

              tempData.push(...item);
            }
          }
        });

        return tempData;
      }

      const line = document.lineAt(position);

      if (line.text === 'process.env.') {
        const env = readEnvs(getRootPath()!);

        return new CompletionList(
          env.map(({ key, value, path }) => ({
            label: key,
            detail: value,
            kind: CompletionItemKind.Value,
            documentation: path,
          }))
        );
      }
    },
  },
  '.'
);

languages.registerDefinitionProvider(['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue'], {
  provideDefinition(document, position, token) {
    const word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_REGEXP));
    const reg = /[\.\-\\\/a-zA-Z0-9]+/;

    const rootPath = getRootPath()!;
    const additionalExt = ['.vue', '.css'];

    if (word.indexOf('@/') === 0) {
      const path = addExt(resolve(rootPath, word.replace('@/', 'src/')), additionalExt);

      if (path) return new Location(Uri.file(path), new Position(0, 0));
    } else if (reg.test(word)) {
      let path = addExt(resolve(rootPath, 'node_modules', word), additionalExt);

      if (path) {
        if (statSync(path).isDirectory()) {
          path = resolve(path, 'package.json');
        }

        return new Location(Uri.file(path), new Position(0, 0));
      }
    } else if (existsSync(word)) {
      return new Location(Uri.file(word), new Position(0, 0));
    }
  },
});
