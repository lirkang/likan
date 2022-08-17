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
  PATH_REGEXP,
  POSITION,
  QUOTES,
} from '@/constants';
import { getConfig, getRootPath, getTargetFilePath, toFirstUpper, verifyExistAndNotDirectory } from '@/utils';

export class LanguageEnvCompletionProvider implements vscode.CompletionItemProvider {
  #envs: Array<Record<'key' | 'value' | 'filepath', string>> = [];
  #rootPath = '';
  #word = '';

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
    const rootPath = getRootPath();

    if (!rootPath) return;

    this.#rootPath = rootPath;

    this.#word = document.lineAt(position).text.substring(0, position.character).trim();

    if (this.#word.endsWith('process.env.')) {
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
    if (!vscode.window.activeTextEditor) return;

    const { fsPath } = vscode.window.activeTextEditor.document.uri;

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
      const locationList = [];

      const filepath = path.join(this.#rootPath, NODE_MODULES, this.#word);

      const target = getTargetFilePath(filepath);

      const manifest = path.join(filepath, PACKAGE_JSON);

      if (target) {
        locationList.push(new vscode.Location(vscode.Uri.file(target), POSITION));
      }

      if (verifyExistAndNotDirectory(manifest)) {
        locationList.push(new vscode.Location(vscode.Uri.file(manifest), POSITION));
      }

      return locationList;
    }
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    this.#word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_REGEXP));

    const rootPath = getRootPath();

    if (!rootPath) return;

    this.#rootPath = rootPath;

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
  // #rootPath = '';
  #word = '';
  #dirPath = '';

  #getDirs(filepath = this.#dirPath) {
    const dirs = fs.readdirSync(filepath);

    return this.#genItem(dirs);
  }

  #genItem(paths: Array<string>): Array<vscode.CompletionItem> {
    return paths.map(p => {
      const filepath = path.join(this.#dirPath, p);

      return {
        label: p,
        kind: fs.statSync(filepath).isDirectory() ? vscode.CompletionItemKind.Folder : vscode.CompletionItemKind.File,
        detail: toFirstUpper(filepath),
      };
    });
  }

  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.#word = document.lineAt(position).text.substring(0, position.character).trim();
    this.#dirPath = path.join(path.dirname(document.uri.fsPath), this.#word);

    if (fs.existsSync(this.#word)) {
      const items = this.#getDirs(this.#word);

      return new vscode.CompletionList(items, false);
    }

    if (!PATH_REGEXP.test(this.#word)) return;

    const items = this.#getDirs();

    return new vscode.CompletionList(items, false);
  }
}
