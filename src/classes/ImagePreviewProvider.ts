/**
 * @Author
 * @Date 2022/09/09 11:58:23
 * @Filepath likan/src/classes/ImagePreviewProvider.ts
 */

import { fileTypeFromBuffer } from 'file-type';
import { Utils } from 'vscode-uri';

import { JAVASCRIPT_PATH } from '@/common/constants';
import { exists, getRootUri } from '@/common/utils';

class ImagePreviewProvider implements vscode.HoverProvider {
  #uri?: vscode.Uri;

  #init () {
    this.#uri = undefined;
  }

  #absolutePath (uri: vscode.Uri, fsPath: string) {
    return vscode.Uri.file(fsPath);
  }

  #relativePath (uri: vscode.Uri, fsPath: string) {
    return vscode.Uri.joinPath(uri, '..', fsPath);
  }

  async #aliasPath (uri: vscode.Uri, fsPath: string) {
    const rootUri = await getRootUri(uri);

    if (!rootUri) return;

    for (const key of Object.keys(Configuration.ALIAS))
      if (fsPath.startsWith(key)) {
        const aliasPath = fsPath.replace(new RegExp(`^${key}`), Configuration.ALIAS[key]);

        return vscode.Uri.joinPath(rootUri, aliasPath.replace('${root}', ''));
      }
  }

  async provideHover (document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const textRange = document.getWordRangeAtPosition(position, JAVASCRIPT_PATH);

    if (!textRange) return;

    const { start, end } = textRange;
    const text = document.getText(new vscode.Range(start.translate(0, 1), end.translate(0, -1)));

    if (text.length === 0) return;

    for await (const getter of [ this.#absolutePath, this.#relativePath, this.#aliasPath ]) {
      const uri = await getter(document.uri, text);

      if (!uri || !exists(uri)) continue;

      const fileType = await fileTypeFromBuffer(await vscode.workspace.fs.readFile(uri));

      if (fileType?.mime.startsWith('image/')) {
        this.#uri = uri;

        break;
      }
    }

    if (!this.#uri) return;

    return new vscode.Hover([
      `![${Utils.basename(this.#uri)}](${this.#uri}|width=200)`,
      `[${Utils.basename(this.#uri)}](${this.#uri})`,
    ]);
  }
}

const imagePreviewProvider = new ImagePreviewProvider();

export default imagePreviewProvider;
