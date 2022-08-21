/**
 * @Author likan
 * @Date 2022/8/15 23:03:49
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\javascript.ts
 */

import {
  EMPTY_STRING,
  ENV_FILES,
  JAVASCRIPT_PATH,
  NODE_MODULES,
  PACKAGE_JSON,
  PACKAGE_JSON_PATH,
  POSITION,
} from '@/constants';
import {
  getConfig,
  getRootPath,
  getTargetFilePath,
  removeMatchedStringAtStartAndEnd,
  toFirstUpper,
  verifyExistAndNotDirectory,
} from '@/utils';

export class EnvProvider implements vscode.CompletionItemProvider {
  #envProperties: Array<vscode.CompletionItem> = [];
  #rootPath = EMPTY_STRING;

  #getEnvProperties() {
    ENV_FILES.forEach(e => {
      const filepath = path.join(this.#rootPath, e);

      if (verifyExistAndNotDirectory(filepath)) {
        const fileData = fs.readFileSync(filepath, 'utf-8').toString();

        if (fileData.trim()) {
          fileData.split('\n').forEach(s => {
            s = s.trim();

            const indexof = s.indexOf('=');

            if (indexof !== -1 && !s.startsWith('#')) {
              this.#envProperties.push({
                label: s.slice(0, indexof).trim(),
                detail: s.slice(indexof + 1, s.length).trim(),
                kind: vscode.CompletionItemKind.Property,
                documentation: toFirstUpper(path.join(this.#rootPath, e)),
              });
            }
          });
        }
      }
    });
  }

  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.#envProperties = [];

    const rootPath = getRootPath();
    const word = document.lineAt(position).text.substring(0, position.character).trim();

    if (!word.endsWith('process.env.') || !rootPath) return;

    this.#rootPath = rootPath;

    this.#getEnvProperties();

    return new vscode.CompletionList(this.#envProperties);
  }
}

export class JumpProvider implements vscode.DefinitionProvider {
  #word = EMPTY_STRING;
  #rootPath = EMPTY_STRING;
  #locations: Array<vscode.Location> = [];

  set locations(fsPath: string | undefined) {
    if (!fsPath || !verifyExistAndNotDirectory(fsPath)) return;

    this.#locations.push(new vscode.Location(vscode.Uri.file(fsPath), POSITION));
  }

  #getRelativePathDefinition() {
    if (!vscode.window.activeTextEditor) return;

    const { fsPath } = vscode.window.activeTextEditor.document.uri;

    this.locations = getTargetFilePath(path.dirname(fsPath), this.#word);
  }

  #getAbsolutePathDefinition() {
    this.locations = getTargetFilePath(this.#word);
  }

  #getAliasPathDefinition() {
    const aliasMap = getConfig('alias');

    for (const a of Object.keys(aliasMap)) {
      if (this.#word.startsWith(a) && ['/', undefined].includes(this.#word.replace(a, EMPTY_STRING)[0])) {
        let rootPath = this.#rootPath;
        const word = this.#word.replace(a, EMPTY_STRING);

        if (aliasMap[a].startsWith('${root}')) {
          rootPath += aliasMap[a].replace('${root}', EMPTY_STRING);

          this.locations = getTargetFilePath(path.join(rootPath, word));
        } else {
          rootPath += aliasMap[a];

          this.locations = getTargetFilePath(path.join(rootPath, word));
        }
      }
    }
  }

  #getPackageJsonDefinition() {
    if (PACKAGE_JSON_PATH.test(this.#word)) {
      const filepath = path.join(this.#rootPath, NODE_MODULES, this.#word);

      const target = getTargetFilePath(filepath);
      const manifest = path.join(filepath, PACKAGE_JSON);

      this.locations = manifest;
      this.locations = target;
    }
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    this.#locations = [];

    const word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_PATH));
    const rootPath = getRootPath();

    if (!rootPath || !word) return;

    this.#rootPath = rootPath;
    this.#word = removeMatchedStringAtStartAndEnd(word);

    this.#getRelativePathDefinition();
    this.#getAbsolutePathDefinition();
    this.#getAliasPathDefinition();
    this.#getPackageJsonDefinition();

    return this.#locations;
  }
}

export class PathProvider implements vscode.CompletionItemProvider {
  #basename = EMPTY_STRING;
  #word = EMPTY_STRING;
  #dirPath = EMPTY_STRING;

  #getRelativeDirs() {
    const paths = fs.readdirSync(path.join(this.#dirPath));

    return this.#generateList(paths.filter(p => p.startsWith(this.#basename)));
  }

  #generateList(paths: Array<string>): Array<vscode.CompletionItem> {
    return paths.map(p => {
      const filepath = path.join(this.#dirPath, p);

      const stat = fs.statSync(filepath);

      return {
        label: p,
        kind: stat.isDirectory() ? vscode.CompletionItemKind.Folder : vscode.CompletionItemKind.File,
        detail: toFirstUpper(filepath),
        insertText: stat.isDirectory() ? `${p}/` : p,
        command: { command: 'editor.action.triggerSuggest', title: 'Trigger next' },
      };
    });
  }

  #setExactlyDirPath() {
    if (['/', './'].includes(this.#word)) return;

    if (this.#word.endsWith('/')) {
      this.#dirPath = path.join(this.#dirPath, this.#word);
    } else {
      const dirname = path.dirname(this.#word);
      this.#basename = path.basename(this.#word);

      this.#dirPath = path.join(this.#dirPath, dirname);
    }
  }

  #getAliasDirs() {
    // const alias = getConfig('alias');
  }

  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.#word = document.lineAt(position).text.substring(0, position.character).trim();
    this.#dirPath = path.dirname(document.uri.fsPath);

    this.#word = removeMatchedStringAtStartAndEnd(this.#word);

    this.#setExactlyDirPath();

    const relativeDirs = this.#getRelativeDirs();

    return new vscode.CompletionList(relativeDirs);
  }
}
