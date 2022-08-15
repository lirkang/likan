/**
 * @Author likan
 * @Date 2022/8/15 23:03:49
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\javascript.ts
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
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

import {
  ENV_FILES,
  JAVASCRIPT_REGEXP,
  NODE_MODULES,
  PACKAGE_JSON,
  PACKAGE_JSON_DEPS,
  POSITION,
  QUOTES,
} from '@/constants';
import { getRootPath, getTargetFilePath, toFirstUpper } from '@/utils';

export class LanguageEnvCompletionProvider implements CompletionItemProvider {
  #envs: Array<Record<'key' | 'value' | 'path', string>> = [];
  #rootPath = getRootPath()!;

  private getEnvs() {
    ENV_FILES.forEach(e => {
      const filepath = join(this.#rootPath, e);

      if (existsSync(filepath)) {
        const fileData = readFileSync(filepath, 'utf-8').toString();

        if (fileData.trim()) {
          fileData.split('\n').forEach(s => {
            s = s.trim();

            const indexof = s.indexOf('=');

            if (indexof !== -1 && !s.startsWith('#')) {
              this.#envs.push({
                key: s.slice(0, indexof).trim(),
                value: s.slice(indexof + 1, s.length).trim(),
                path: e,
              });
            }
          });
        }
      }
    });
  }

  provideCompletionItems(document: TextDocument, position: Position) {
    const text = document.lineAt(position).text.substring(0, position.character).trim();

    if (text.endsWith('process.env.')) {
      this.getEnvs();

      return new CompletionList(
        this.#envs.map(({ key, value, path }) => ({
          label: key,
          detail: value,
          kind: CompletionItemKind.Property,
          documentation: toFirstUpper(join(this.#rootPath, path)),
        }))
      );
    }
  }
}

export class LanguagePathJumpDefinitionProvider implements DefinitionProvider {
  #word = '';
  #rootPath = getRootPath()!;

  private replaceQuotes() {
    if (QUOTES.find(q => this.#word.startsWith(q))) {
      this.#word = this.#word.slice(1);
    }

    if (QUOTES.find(q => this.#word.endsWith(q))) {
      this.#word = this.#word.slice(0, this.#word.length - 1);
    }
  }

  private verifyIsRelativePath() {
    const target = getTargetFilePath(dirname(window.activeTextEditor!.document.uri.fsPath), this.#word);

    if (target) return new Location(Uri.file(target), POSITION);
  }

  private verifyIsAbsolutePath() {
    const target = getTargetFilePath(this.#word);

    if (target) return new Location(Uri.file(target), POSITION);
  }

  private verifyIsAliasPath() {
    const target = getTargetFilePath(this.#rootPath, this.#word.replace('@', 'src'));

    if (target) return new Location(Uri.file(target), POSITION);
  }

  private verifyIsPackageJsonPath() {
    if (PACKAGE_JSON_DEPS.test(this.#word)) {
      const path = join(this.#rootPath, NODE_MODULES, this.#word);

      const target = getTargetFilePath(path);

      if (target) return new Location(Uri.file(target), POSITION);

      const manifest = join(path, PACKAGE_JSON);

      if (existsSync(manifest) && !statSync(manifest).isDirectory()) return new Location(Uri.file(manifest), POSITION);
    }
  }

  provideDefinition(document: TextDocument, position: Position) {
    this.#word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_REGEXP));

    this.replaceQuotes();

    const relativePath = this.verifyIsRelativePath();
    if (relativePath) return relativePath;

    const absolutePath = this.verifyIsAbsolutePath();
    if (absolutePath) return absolutePath;

    const aliasPath = this.verifyIsAliasPath();
    if (aliasPath) return aliasPath;

    const packageJsonPath = this.verifyIsPackageJsonPath();
    if (packageJsonPath) return packageJsonPath;
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
