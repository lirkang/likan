/**
 * @Author
 * @Date 2022/09/09 11:58:23
 * @FilePath E:\TestSpace\extension\likan\src\classes\ImagePreviewProvider.ts
 */

import { EMPTY_STRING, JAVASCRIPT_PATH, PIC_EXTS, UNDEFINED } from '@/common/constants';
import { getConfig, getKeys, getRootPath, removeMatchedStringAtStartAndEnd } from '@/common/utils';

class ImagePreviewProvider implements vscode.HoverProvider {
  #uri?: vscode.Uri;

  #init() {
    this.#uri = UNDEFINED;
  }

  #absolutePath(uri: vscode.Uri, fsPath: string) {
    return vscode.Uri.file(fsPath);
  }

  #relativePath(uri: vscode.Uri, fsPath: string) {
    return vscode.Uri.joinPath(uri, '..', fsPath);
  }

  #aliasPath(uri: vscode.Uri, fsPath: string) {
    const rootPath = getRootPath(uri.fsPath);
    if (!rootPath) return;

    const rootUri = vscode.Uri.file(rootPath);
    const { alias } = getConfig();

    for (const key of getKeys(alias)) {
      if (fsPath.startsWith(key)) {
        const aliasPath = fsPath.replace(new RegExp(`^${key}`), alias[key]);

        return vscode.Uri.joinPath(rootUri, aliasPath.replace('${root}', EMPTY_STRING));
      }
    }
  }

  provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
    this.#init();

    const textRange = document.getWordRangeAtPosition(position, JAVASCRIPT_PATH);
    const text = removeMatchedStringAtStartAndEnd(document.getText(textRange));

    if (!text) return;

    for (const function_ of [this.#absolutePath, this.#relativePath, this.#aliasPath]) {
      const uri = function_(document.uri, text);

      if (!uri) return;

      if (fs.existsSync(uri.fsPath) && PIC_EXTS.includes(path.extname(uri.fsPath))) {
        this.#uri = uri;

        break;
      }
    }

    if (!this.#uri) return;

    return new vscode.Hover(
      new vscode.MarkdownString(`
![${path.basename(this.#uri.fsPath)}](${this.#uri}|width=200)\n
[${path.basename(this.#uri.fsPath)}](${this.#uri})
    `)
    );
  }
}

const imagePreviewProvider = new ImagePreviewProvider();

export default imagePreviewProvider;
