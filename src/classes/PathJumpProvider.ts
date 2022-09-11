/**
 * @Author likan
 * @Date 2022/09/03 09:07:19
 * @FilePath D:\CodeSpace\Dev\likan\src\class\PathJumpProvider.ts
 */

import { EMPTY_STRING, JAVASCRIPT_PATH, NODE_MODULES, PACKAGE_JSON, POSITION } from '@/common/constants';
import { getConfig, getKeys, getRootPath, getTargetFilePath, removeMatchedStringAtStartAndEnd } from '@/common/utils';

class PathJumpProvider implements vscode.DefinitionProvider {
  #locations: Array<vscode.Location> = [];

  #relativePath(rootPath: string, fsPath: string, uri: vscode.Uri) {
    return path.join(uri.fsPath, '..', fsPath);
  }

  #absolutePath(rootPath: string, fsPath: string, uri: vscode.Uri) {
    return path.join(fsPath);
  }

  #aliasPath(rootPath: string, fsPath: string, uri: vscode.Uri) {
    const aliasMap = getConfig('alias');

    for (const alias of getKeys(aliasMap)) {
      const regExp = new RegExp(`^${alias}`);

      if (regExp.test(fsPath)) {
        const aliasPath = fsPath.replace(regExp, aliasMap[alias]);

        return path.join(rootPath, aliasPath.replace('${root}', EMPTY_STRING));
      }
    }
  }

  #packageJson(rootPath: string, fsPath: string, uri: vscode.Uri) {
    const filepath = path.join(rootPath, NODE_MODULES, fsPath);

    const target = path.join(filepath);
    const manifest = path.join(filepath, PACKAGE_JSON);

    return [target, manifest];
  }

  #init() {
    this.#locations = [];
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const wordRange = document.getWordRangeAtPosition(position, JAVASCRIPT_PATH);
    const fsPath = removeMatchedStringAtStartAndEnd(document.getText(wordRange));
    const rootPath = getRootPath();

    if (!fsPath || !rootPath) return;

    const results = [this.#absolutePath, this.#relativePath, this.#packageJson, this.#aliasPath].flatMap(function_ =>
      function_(rootPath, fsPath, document.uri)
    );

    for (const fsPath of results) {
      if (!fsPath) continue;

      const uri = getTargetFilePath(fsPath);

      if (!uri) continue;

      this.#locations.push(new vscode.Location(uri, POSITION));
    }

    console.log(this.#locations);

    return this.#locations;
  }
}

const pathJumpProvider = new PathJumpProvider();

export default pathJumpProvider;
