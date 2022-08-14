/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import {
  DEFAULT_EXT,
  EMPTY_ARRAY,
  EMPTY_STRING,
  ENV_FILES,
  JAVASCRIPT_REGEXP,
  JSON_REGEXP,
  NODE_MODULES,
  PACKAGE_JSON,
  POSITION,
} from '@/constants';
import { addExt, getDocComment, getRootPath, toFirstUpper } from '@/utils';
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, extname, join } from 'path';
import { CompletionItemKind, CompletionList, languages, Location, Uri, window, workspace } from 'vscode';

workspace.onDidCreateFiles(({ files }) => {
  files.forEach(uri => {
    const suffix = extname(uri.fsPath);

    if (DEFAULT_EXT.includes(suffix) && !readFileSync(uri.fsPath, 'utf-8').toString().length) {
      writeFileSync(uri.fsPath, getDocComment(uri));
    }
  });
});

languages.registerDefinitionProvider(
  { language: 'json', pattern: `**/${PACKAGE_JSON}` },
  {
    provideDefinition(document, position) {
      const word = document.getText(document.getWordRangeAtPosition(position));

      const targetDir = join(
        dirname(document.fileName),
        NODE_MODULES,
        word.replaceAll('"', EMPTY_STRING),
        PACKAGE_JSON
      );

      if (existsSync(targetDir) && !statSync(targetDir).isDirectory())
        return new Location(Uri.file(targetDir), POSITION);
    },
  }
);

languages.setLanguageConfiguration('json', { wordPattern: JSON_REGEXP });

languages.setLanguageConfiguration('typescript', { wordPattern: JAVASCRIPT_REGEXP });

languages.setLanguageConfiguration('javascript', { wordPattern: JAVASCRIPT_REGEXP });

languages.setLanguageConfiguration('typescriptreact', { wordPattern: JAVASCRIPT_REGEXP });

languages.setLanguageConfiguration('javascriptreact', { wordPattern: JAVASCRIPT_REGEXP });

languages.registerCompletionItemProvider(
  ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue'],
  {
    provideCompletionItems(document, position, token, context) {
      function readEnvs(path: string): Array<Data> {
        const tempData: Array<Data> = EMPTY_ARRAY;

        ENV_FILES.forEach(e => {
          const filepath = join(path, e);

          if (existsSync(filepath)) {
            const fileData = readFileSync(filepath, 'utf-8').toString();

            if (fileData.trim()) {
              const item = fileData
                .split('\n')
                .map(s => {
                  if (s.indexOf('#') === 0) return;

                  s = s.trim();

                  const indexof = s.indexOf('=');

                  if (indexof === -1) return;

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
        const rootPath = getRootPath(true)!;

        const env = readEnvs(rootPath);

        return new CompletionList(
          env.map(({ key, value, path }) => ({
            label: key,
            detail: value,
            kind: CompletionItemKind.Value,
            documentation: toFirstUpper(join(rootPath, path)),
          }))
        );
      }
    },
  },
  '.'
);

languages.registerDefinitionProvider(['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue'], {
  provideDefinition(document, position, token) {
    let word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_REGEXP));

    if ([word?.indexOf("'"), word?.indexOf('"'), word?.indexOf('`')].includes(0)) word = word.slice(1);

    if ([word?.lastIndexOf("'"), word?.lastIndexOf('"'), word?.lastIndexOf('`')].includes(word.length - 1))
      word = word.slice(0, word.length - 1);

    if (existsSync(word) && !statSync(word).isDirectory()) return new Location(Uri.file(word), POSITION);

    const path = join(dirname(window.activeTextEditor!.document.uri.fsPath), word);

    if (existsSync(path) && !statSync(path).isDirectory()) return new Location(Uri.file(path), POSITION);

    const reg = /[\.\-\\\/\w\d]+/;

    const rootPath = getRootPath(true)!;

    if (word.indexOf('@/') === 0) {
      const aliasPath = join(rootPath, word.replace('@/', 'src/'));

      if (existsSync(aliasPath) && !statSync(aliasPath).isDirectory())
        return new Location(Uri.file(aliasPath), POSITION);

      const addExtPath = addExt(join(aliasPath));

      if (addExtPath && !statSync(addExtPath).isDirectory()) return new Location(Uri.file(addExtPath), POSITION);
    }

    if (reg.test(word)) {
      let path = join(rootPath, NODE_MODULES, word);

      if (existsSync(path)) {
        if (statSync(path).isDirectory()) {
          if (existsSync(join(path, PACKAGE_JSON))) {
            return new Location(Uri.file(join(path, PACKAGE_JSON)), POSITION);
          }
        } else {
          return new Location(Uri.file(path), POSITION);
        }
      } else {
        const addExtPath = addExt(join(rootPath, NODE_MODULES, word), ['.css']);

        if (!addExtPath) return;

        if (statSync(addExtPath).isDirectory()) {
          if (existsSync(join(addExtPath, PACKAGE_JSON))) {
            return new Location(Uri.file(join(addExtPath, PACKAGE_JSON)), POSITION);
          }
        } else {
          return new Location(Uri.file(addExtPath), POSITION);
        }
      }
    }
  },
});
