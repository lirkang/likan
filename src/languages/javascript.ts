/**
 * @Author likan
 * @Date 2022/8/15 23:03:49
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\javascript.ts
 */

import { existsSync, readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import {
  CompletionItemKind,
  CompletionItemProvider,
  CompletionList,
  DefinitionProvider,
  Location,
  Position,
  TextDocument,
  Uri,
  window,
} from 'vscode';

import { JAVASCRIPT_REGEXP, NODE_MODULES, PACKAGE_JSON, PACKAGE_JSON_DEPS, POSITION, QUOTES } from '@/constants';
import { getRootPath, getTargetFilePath, readEnvs, toFirstUpper } from '@/utils';

export class LanguageEnvCompletionProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position) {
    const text = document.lineAt(position).text.substring(0, position.character).trim();

    if (text.endsWith('process.env.')) {
      const rootPath = getRootPath()!;

      const env = readEnvs(rootPath);

      return new CompletionList(
        env.map(({ key, value, path }) => ({
          label: key,
          detail: value,
          kind: CompletionItemKind.Property,
          documentation: toFirstUpper(join(rootPath, path)),
        }))
      );
    }
  }
}

export class LanguagePathJumpDefinitionProvider implements DefinitionProvider {
  provideDefinition(document: TextDocument, position: Position) {
    let word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_REGEXP));

    if (QUOTES.find(q => word.startsWith(q))) word = word.slice(1);
    if (QUOTES.find(q => word.endsWith(q))) word = word.slice(0, word.length - 1);

    {
      const target = getTargetFilePath(word);

      if (target) return new Location(Uri.file(target), POSITION);
    }

    {
      const target = getTargetFilePath(dirname(window.activeTextEditor!.document.uri.fsPath), word);

      if (target) return new Location(Uri.file(target), POSITION);
    }

    const rootPath = getRootPath()!;

    if (word.startsWith('@/')) {
      const target = getTargetFilePath(rootPath, word.replace('@', 'src'));

      if (target) return new Location(Uri.file(target), POSITION);
    } else if (PACKAGE_JSON_DEPS.test(word)) {
      const path = join(rootPath, NODE_MODULES, word);

      const target = getTargetFilePath(path);

      if (target) return new Location(Uri.file(target), POSITION);

      const manifest = join(path, PACKAGE_JSON);

      if (existsSync(manifest) && !statSync(manifest).isDirectory()) return new Location(Uri.file(manifest), POSITION);
    }
  }
}

export class LanguagePathCompletionProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position) {
    // eslint-disable-next-line no-useless-escape
    const text = document.lineAt(position).text.substring(0, position.character).replace(/^.*\'/, '').trim();

    // eslint-disable-next-line no-useless-escape
    const regexp = /[\\\/\.\d\w]+$/;

    if (regexp.test(text)) {
      const rootPath = getRootPath()!;
      const { document } = window.activeTextEditor!;

      const path = join(dirname(document.uri.fsPath), text);

      if (existsSync(path) && statSync(path).isDirectory()) {
        return new CompletionList(
          readdirSync(path).map(d => {
            let label = d;

            if (statSync(join(path, d)).isDirectory()) {
              label += '/';

              if (!text.endsWith('/')) {
                label = '/' + label;
              }
            }

            return { label, detail: join(path, d) };
          }),
          true
        );
      }
    }
  }
}
