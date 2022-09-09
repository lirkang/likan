/**
 * @Author
 * @Date 2022/09/09 11:58:23
 * @FilePath E:\TestSpace\extension\likan\src\classes\ImagePreviewProvider.ts
 */

import { JAVASCRIPT_PATH, PIC_EXTS, UNDEFINED } from '@/common/constants';
import { removeMatchedStringAtStartAndEnd } from '@/common/utils';

class ImagePreviewProvider implements vscode.HoverProvider {
  #uri?: vscode.Uri;

  #init() {
    this.#uri = UNDEFINED;
  }

  #verify(uri) {
    if (!fs.existsSync(this.#uri.fsPath)) this.#uri = UNDEFINED;
  }

  #relativePath(uri: vscode.Uri, fsPath: string) {
    if (this.#uri) return;

    return vscode.Uri.joinPath(uri, '..', fsPath);
  }

  #aliasPath(uri: vscode.Uri, fsPath: string) {
    if (this.#uri) return;
  }

  #absolutePath(uri: vscode.Uri, fsPath: string) {
    if (this.#uri) return;

    return vscode.Uri.file(fsPath);
  }

  provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
    this.#init();

    const textRange = document.getWordRangeAtPosition(position, JAVASCRIPT_PATH);
    const text = removeMatchedStringAtStartAndEnd(document.getText(textRange));

    if (!text) return;

    this.#absolutePath(document.uri, text);
    this.#relativePath(document.uri, text);
    this.#aliasPath(document.uri, text);

    if (!this.#uri || !PIC_EXTS.includes(path.extname(this.#uri.fsPath))) return;

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
