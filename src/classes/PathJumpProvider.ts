/**
 * @Author likan
 * @Date 2022/09/03 09:07:19
 * @Filepath likan/src/classes/PathJumpProvider.ts
 */

import { unary } from 'lodash-es';
import { Utils } from 'vscode-uri';

import { JAVASCRIPT_PATH } from '@/common/constants';
import { exists, getRootUri, getTargetFilePath } from '@/common/utils';

class PathJumpProvider implements vscode.DefinitionProvider {
  #locations: Array<vscode.Location> = [];

  #relativePath (rootUri: vscode.Uri, fsPath: string, uri: vscode.Uri) {
    return vscode.Uri.joinPath(Utils.dirname(uri), fsPath);
  }

  #absolutePath (rootUri: vscode.Uri, fsPath: string) {
    return vscode.Uri.file(fsPath);
  }

  #aliasPath (rootUri: vscode.Uri, fsPath: string) {
    for (const alias of Object.keys(Configuration.alias)) {
      const regExp = new RegExp(`^${alias}`, 'u');

      if (regExp.test(fsPath)) {
        const aliasPath = fsPath.replace(regExp, Configuration.alias[alias]);

        return vscode.Uri.joinPath(rootUri, aliasPath.replace('${root}', ''));
      }
    }
  }

  #packageJson (rootUri: vscode.Uri, fsPath: string) {
    const targetUri = vscode.Uri.joinPath(rootUri, 'node_modules', fsPath);
    const manifest = vscode.Uri.joinPath(targetUri, 'package.json');

    return [ targetUri, manifest ];
  }

  #init () {
    this.#locations = [];
  }

  async provideDefinition (document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const range = document.getWordRangeAtPosition(position, JAVASCRIPT_PATH);

    if (!range) return;

    const { start, end } = range;
    const rangeWithoutQuote = range.with(start.translate(0, 1), end.translate(0, -1));
    const targetPath = document.getText(rangeWithoutQuote);
    const rootPath = await getRootUri();

    if (!rootPath) return;

    const results = [ this.#absolutePath, this.#relativePath, this.#packageJson, this.#aliasPath ].flatMap(caller => caller(rootPath, targetPath, document.uri));

    for await (const resultUri of results) {
      if (!resultUri) continue;

      const uris = await getTargetFilePath(resultUri);
      const position = new vscode.Position(0, 0);

      this.#locations.push(...uris.filter(unary(exists)).map(uri => new vscode.Location(uri, position)));
    }

    return this.#locations;
  }
}

const pathJumpProvider = new PathJumpProvider();

export default pathJumpProvider;
