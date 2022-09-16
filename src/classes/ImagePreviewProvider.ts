/**
 * @Author
 * @Date 2022/09/09 11:58:23
 * @FilePath E:\TestSpace\extension\likan\src\classes\ImagePreviewProvider.ts
 */

import { Utils } from 'vscode-uri';

import { EMPTY_STRING, JAVASCRIPT_PATH, PIC_EXTS, VOID } from '@/common/constants';
import { exist, getConfig, getKeys, getRootUri } from '@/common/utils';

class ImagePreviewProvider implements vscode.HoverProvider {
  #uri?: vscode.Uri;

  #init() {
    this.#uri = VOID;
  }

  #absolutePath(uri: vscode.Uri, fsPath: string) {
    return vscode.Uri.file(fsPath);
  }

  #relativePath(uri: vscode.Uri, fsPath: string) {
    return vscode.Uri.joinPath(uri, '..', fsPath);
  }

  async #aliasPath(uri: vscode.Uri, fsPath: string) {
    const rootUri = await getRootUri(uri);
    if (!rootUri) return;

    const { alias } = getConfig();

    for (const key of getKeys(alias)) {
      if (fsPath.startsWith(key)) {
        const aliasPath = fsPath.replace(new RegExp(`^${key}`), alias[key]);

        return vscode.Uri.joinPath(rootUri, aliasPath.replace('${root}', EMPTY_STRING));
      }
    }
  }

  async provideHover(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const textRange = document.getWordRangeAtPosition(position, JAVASCRIPT_PATH);

    if (!textRange) return;

    const { start, end } = textRange;
    const text = document.getText(new vscode.Range(start.translate(0, 1), end.translate(0, -1)));

    if (!text) return;

    for await (const function_ of [this.#absolutePath, this.#relativePath, this.#aliasPath]) {
      const uri = await function_(document.uri, text);

      if (!uri) return;

      if (exist(uri) && PIC_EXTS.includes(Utils.extname(uri))) {
        this.#uri = uri;

        break;
      }
    }

    if (!this.#uri) return;

    const contents = new vscode.MarkdownString(`
![${Utils.basename(this.#uri)}](${this.#uri}|width=200)\n
[${Utils.basename(this.#uri)}](${this.#uri})`);

    return new vscode.Hover([contents]);
  }
}

const imagePreviewProvider = new ImagePreviewProvider();

export default imagePreviewProvider;
