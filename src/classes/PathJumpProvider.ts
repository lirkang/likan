/**
 * @Author likan
 * @Date 2022/09/03 09:07:19
 * @Filepath likan/src/classes/PathJumpProvider.ts
 */

import { unary } from 'lodash-es';
import { Utils } from 'vscode-uri';

import { JAVASCRIPT_PATH } from '@/common/constants';
import { exists, findRoot, findTargetFile } from '@/common/utils';

class PathJumpProvider implements vscode.DefinitionProvider {
  private _locations: Array<vscode.Location> = [];

  private _asRelativePath (rootUri: vscode.Uri, fsPath: string, uri: vscode.Uri) {
    return vscode.Uri.joinPath(Utils.dirname(uri), fsPath);
  }

  private _asAbsolutePath (rootUri: vscode.Uri, fsPath: string) {
    return vscode.Uri.file(fsPath);
  }

  private _asAliasPath (rootUri: vscode.Uri, fsPath: string) {
    for (const alias of Object.keys(Configuration.ALIAS)) {
      const regExp = new RegExp(`^${alias}`);

      if (regExp.test(fsPath)) {
        const aliasPath = fsPath.replace(regExp, Configuration.ALIAS[alias]);

        return vscode.Uri.joinPath(rootUri, aliasPath.replace('${root}', ''));
      }
    }
  }

  private _asPackageJson (rootUri: vscode.Uri, fsPath: string) {
    const targetUri = vscode.Uri.joinPath(rootUri, 'node_modules', fsPath);
    const manifest = vscode.Uri.joinPath(targetUri, 'package.json');

    return [ targetUri, manifest ];
  }

  private _init () {
    this._locations = [];
  }

  public async provideDefinition (document: vscode.TextDocument, position: vscode.Position) {
    this._init();

    const range = document.getWordRangeAtPosition(position, JAVASCRIPT_PATH);

    if (!range) return;

    const { start, end } = range;
    const rangeWithoutQuote = range.with(start.translate(0, 1), end.translate(0, -1));
    const targetPath = document.getText(rangeWithoutQuote);
    const rootPath = await findRoot(document.uri);

    if (!rootPath) return;

    const results = [ this._asAbsolutePath, this._asRelativePath, this._asPackageJson, this._asAliasPath ].flatMap(caller => caller(rootPath, targetPath, document.uri));

    for await (const resultUri of results) {
      if (!resultUri) continue;

      const uris = await findTargetFile(resultUri);
      const position = new vscode.Position(0, 0);

      this._locations.push(...uris.filter(unary(exists)).map(uri => new vscode.Location(uri, position)));
    }

    return this._locations;
  }
}

const pathJumpProvider = new PathJumpProvider();

export default pathJumpProvider;
