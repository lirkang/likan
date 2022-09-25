/**
 * @Author likan
 * @Date 2022/09/03 09:07:19
 * @Filepath src/classes/PathJumpProvider.ts
 */

import { Utils } from 'vscode-uri';

import { JAVASCRIPT_PATH } from '@/common/constants';
import { getConfig, getKeys, getRootUri, getTargetFilePath } from '@/common/utils';

class PathJumpProvider implements vscode.DefinitionProvider {
  #locations: Array<vscode.Location> = [];

  #relativePath(rootUri: vscode.Uri, fsPath: string, uri: vscode.Uri) {
    return vscode.Uri.joinPath(Utils.dirname(uri), fsPath);
  }

  #absolutePath(rootUri: vscode.Uri, fsPath: string) {
    return vscode.Uri.file(fsPath);
  }

  #aliasPath(rootUri: vscode.Uri, fsPath: string) {
    const aliasMap = getConfig('alias');

    for (const alias of getKeys(aliasMap)) {
      const regExp = new RegExp(`^${alias}`);

      if (regExp.test(fsPath)) {
        const aliasPath = fsPath.replace(regExp, aliasMap[alias]);

        return vscode.Uri.joinPath(rootUri, aliasPath.replace('${root}', ''));
      }
    }
  }

  #packageJson(rootUri: vscode.Uri, fsPath: string) {
    const targetUri = vscode.Uri.joinPath(rootUri, 'node_modules', fsPath);
    const manifest = vscode.Uri.joinPath(targetUri, 'package.json');

    return [targetUri, manifest];
  }

  #init() {
    this.#locations = [];
  }

  async provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const wordRange = document.getWordRangeAtPosition(position, JAVASCRIPT_PATH);

    if (!wordRange) return;

    const { start, end } = wordRange;
    const modulePath = document.getText(new vscode.Range(start.translate(0, 1), end.translate(0, -1)));
    const rootPath = await getRootUri();

    if (!modulePath || !rootPath) return;

    const results = [this.#absolutePath, this.#relativePath, this.#packageJson, this.#aliasPath].flatMap(function_ =>
      function_(rootPath, modulePath, document.uri)
    );

    for await (const resultUri of results) {
      if (!resultUri) continue;

      const uri = await getTargetFilePath(resultUri);

      if (!uri) continue;

      const { type } = await vscode.workspace.fs.stat(uri);

      if (type !== vscode.FileType.File) continue;

      this.#locations.push(new vscode.Location(uri, new vscode.Position(0, 0)));
    }

    return this.#locations;
  }
}

const pathJumpProvider = new PathJumpProvider();

export default pathJumpProvider;
