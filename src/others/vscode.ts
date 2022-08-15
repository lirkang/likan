/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import {
  DEFAULT_EXT,
  EMPTY_STRING,
  JAVASCRIPT_REGEXP,
  JSON_REGEXP,
  NODE_MODULES,
  PACKAGE_JSON,
  POSITION,
  QUOTES
} from '@/constants';
import { getDocComment, getRootPath, getTargetFilePath, readEnvs, toFirstUpper } from '@/utils';
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

// languages.setLanguageConfiguration('typescript', { wordPattern: JAVASCRIPT_REGEXP });

// languages.setLanguageConfiguration('javascript', { wordPattern: JAVASCRIPT_REGEXP });

// languages.setLanguageConfiguration('typescriptreact', { wordPattern: JAVASCRIPT_REGEXP });

// languages.setLanguageConfiguration('javascriptreact', { wordPattern: JAVASCRIPT_REGEXP });

// languages.setLanguageConfiguration('vue', { wordPattern: JAVASCRIPT_REGEXP });

languages.registerCompletionItemProvider(
  ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue'],
  {
    provideCompletionItems(document, position) {
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
  provideDefinition(document, position) {
    let word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_REGEXP));

    if (QUOTES.find(s => word.indexOf(s) === 0)) word = word.slice(1);
    if (QUOTES.find(s => word.lastIndexOf(s) === word.length - 1)) word = word.slice(0, word.length - 1);

    {
      const target = getTargetFilePath(word);

      if (target) return new Location(Uri.file(target), POSITION);
    }

    {
      const target = getTargetFilePath(dirname(window.activeTextEditor!.document.uri.fsPath), word);

      if (target) return new Location(Uri.file(target), POSITION);
    }

    // eslint-disable-next-line no-useless-escape
    const reg = /^[\@\.\-\_\\\/\w\d]+$/;

    const rootPath = getRootPath(true)!;

    if (word.indexOf('@/') === 0) {
      const target = getTargetFilePath(rootPath, word.replace('@', 'src'));

      if (target) return new Location(Uri.file(target), POSITION);
    } else if (reg.test(word)) {
      const path = join(rootPath, NODE_MODULES, word);

      const target = getTargetFilePath(path);

      if (target) return new Location(Uri.file(target), POSITION);

      const manifest = join(path, PACKAGE_JSON);

      if (existsSync(manifest) && !statSync(manifest).isDirectory()) return new Location(Uri.file(manifest), POSITION);
    }
  },
});
