/**
 * @Author likan
 * @Date 2022/09/03 09:07:19
 * @FilePath D:\CodeSpace\Dev\likan\src\class\PathJumpProvider.ts
 */

import {
  EMPTY_STRING,
  JAVASCRIPT_PATH,
  JSON_PATH,
  NODE_MODULES,
  PACKAGE_JSON,
  POSITION,
  UNDEFINED,
} from '@/common/constants';
import {
  getConfig,
  getKeys,
  getRootPath,
  getTargetFilePath,
  removeMatchedStringAtStartAndEnd,
  verifyExistAndNotDirectory,
} from '@/common/utils';

class PathJumpProvider implements vscode.DefinitionProvider {
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

    for (const a of getKeys(aliasMap)) {
      if (this.#word.startsWith(a) && ['/', UNDEFINED].includes(this.#word.replace(a, EMPTY_STRING)[0])) {
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
    if (JSON_PATH.test(this.#word)) {
      const filepath = path.join(this.#rootPath, NODE_MODULES, this.#word);

      const target = getTargetFilePath(filepath);
      const manifest = path.join(filepath, PACKAGE_JSON);

      this.locations = manifest;
      this.locations = target;
    }
  }

  #init() {
    this.#locations = [];
    this.#rootPath = EMPTY_STRING;
    this.#word = EMPTY_STRING;
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_PATH));
    const rootPath = getRootPath();

    this.#word = removeMatchedStringAtStartAndEnd(word);

    if (rootPath) {
      this.#rootPath = rootPath;
      this.#getAliasPathDefinition();
      this.#getPackageJsonDefinition();
    }

    this.#getRelativePathDefinition();
    this.#getAbsolutePathDefinition();

    return this.#locations;
  }
}

const pathJumpProvider = new PathJumpProvider();

export default pathJumpProvider;
