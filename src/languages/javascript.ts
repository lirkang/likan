/**
 * @Author likan
 * @Date 2022/8/15 23:03:49
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\javascript.ts
 */

import {
  ENV_FILES,
  JAVASCRIPT_REGEXP,
  NODE_MODULES,
  PACKAGE_JSON,
  PACKAGE_JSON_DEPS,
  POSITION,
  QUOTES,
} from '@/constants';
import { getConfig, getRootPath, getTargetFilePath, toFirstUpper, verifyExistAndNotDirectory } from '@/utils';

export class LanguageEnvCompletionProvider implements vscode.CompletionItemProvider {
  #envs: Array<Record<'key' | 'value' | 'filepath', string>> = [];
  #rootPath = '';

  #getEnvs() {
    this.#envs = [];

    ENV_FILES.forEach(e => {
      const filepath = path.join(this.#rootPath, e);

      if (verifyExistAndNotDirectory(filepath)) {
        const fileData = fs.readFileSync(filepath, 'utf-8').toString();

        if (fileData.trim()) {
          fileData.split('\n').forEach(s => {
            s = s.trim();

            const indexof = s.indexOf('=');

            if (indexof !== -1 && !s.startsWith('#')) {
              this.#envs.push({
                key: s.slice(0, indexof).trim(),
                value: s.slice(indexof + 1, s.length).trim(),
                filepath: e,
              });
            }
          });
        }
      }
    });
  }

  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.#rootPath = getRootPath()!;

    const text = document.lineAt(position).text.substring(0, position.character).trim();

    if (text.endsWith('process.env.')) {
      this.#getEnvs();

      return new vscode.CompletionList(
        this.#envs.map(({ key, value, filepath }) => ({
          label: key,
          detail: value,
          kind: vscode.CompletionItemKind.Property,
          documentation: toFirstUpper(path.join(this.#rootPath, filepath)),
        }))
      );
    }
  }
}

export class LanguagePathJumpDefinitionProvider implements vscode.DefinitionProvider {
  #word = '';
  #rootPath = '';

  #removeQuotes() {
    if (QUOTES.find(q => this.#word.startsWith(q))) {
      this.#word = this.#word.slice(1);
    }

    if (QUOTES.find(q => this.#word.endsWith(q))) {
      this.#word = this.#word.slice(0, this.#word.length - 1);
    }
  }

  #isRelativePath() {
    const { fsPath } = vscode.window.activeTextEditor!.document.uri;

    const target = getTargetFilePath(path.dirname(fsPath), this.#word);

    if (target) return new vscode.Location(vscode.Uri.file(target), POSITION);
  }

  #isAbsolutePath() {
    const target = getTargetFilePath(this.#word);

    if (target) return new vscode.Location(vscode.Uri.file(target), POSITION);
  }

  #isAliasPath() {
    const aliasMap = getConfig('alias');

    for (const a of Object.keys(aliasMap)) {
      if (this.#word.startsWith(a) && ['/', undefined].includes(this.#word.replace(a, '')[0])) {
        let rootPath = this.#rootPath;
        const word = this.#word.replace(a, '');

        if (aliasMap[a].startsWith('${root}')) {
          rootPath += aliasMap[a].replace('${root}', '');

          const target = getTargetFilePath(path.join(rootPath, word));

          if (target) return new vscode.Location(vscode.Uri.file(target), POSITION);
        } else {
          rootPath += aliasMap[a];

          const target = getTargetFilePath(path.join(rootPath, word));

          if (target) return new vscode.Location(vscode.Uri.file(target), POSITION);
        }
      }
    }
  }

  #isPackageJsonPath() {
    if (PACKAGE_JSON_DEPS.test(this.#word)) {
      const filepath = path.join(this.#rootPath, NODE_MODULES, this.#word);

      const target = getTargetFilePath(filepath);

      if (target) return new vscode.Location(vscode.Uri.file(target), POSITION);

      const manifest = path.join(filepath, PACKAGE_JSON);

      if (verifyExistAndNotDirectory(manifest)) return new vscode.Location(vscode.Uri.file(manifest), POSITION);
    }
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    this.#word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_REGEXP));
    this.#rootPath = getRootPath()!;

    this.#removeQuotes();

    const relativePath = this.#isRelativePath();
    if (relativePath) return relativePath;

    const absolutePath = this.#isAbsolutePath();
    if (absolutePath) return absolutePath;

    const aliasPath = this.#isAliasPath();
    if (aliasPath) return aliasPath;

    const packageJsonPath = this.#isPackageJsonPath();
    if (packageJsonPath) return packageJsonPath;
  }
}

export class LanguagePathCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    // eslint-disable-next-line no-useless-escape
    const text = document.lineAt(position).text.substring(0, position.character).replace(/^.*\'/, '').trim();

    // eslint-disable-next-line no-useless-escape
    const regexp = /[\\\/\.\d\w]+$/;

    if (regexp.test(text)) {
      const rootPath = getRootPath()!;
      const { document } = vscode.window.activeTextEditor!;

      const filepath = path.join(path.dirname(document.uri.fsPath), text);

      if (verifyExistAndNotDirectory(filepath)) {
        return new vscode.CompletionList(
          fs.readdirSync(filepath).map(d => {
            let label = d;

            if (fs.statSync(path.join(filepath, d)).isDirectory()) {
              label += '/';

              if (!text.endsWith('/')) {
                label = '/' + label;
              }
            }

            return { label, detail: path.join(filepath, d) };
          }),
          true
        );
      }
    }
  }
}
