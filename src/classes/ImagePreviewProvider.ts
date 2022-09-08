/**
 * @Author
 * @Date 2022/09/09 11:58:23
 * @FilePath E:\TestSpace\extension\likan\src\classes\ImagePreviewProvider.ts
 */

import { JAVASCRIPT_PATH } from '@/common/constants';
import { removeMatchedStringAtStartAndEnd } from '@/common/utils';

class ImagePreviewProvider implements vscode.HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
    const textRange = document.getWordRangeAtPosition(position, JAVASCRIPT_PATH);

    if (!textRange) return;

    const text = document.getText(textRange);

    if (!text) return;

    const fsUri = vscode.Uri.joinPath(document.uri, '..', removeMatchedStringAtStartAndEnd(text));

    if (!fs.existsSync(fsUri.fsPath)) return;

    if (
      ![
        '.bmp',
        '.jpg',
        '.jpeg',
        '.png',
        '.tif',
        '.gif',
        '.pcx',
        '.tga',
        '.exif',
        '.fpx',
        '.svg',
        '.psd',
        '.cdr',
        '.pcd',
        '.dxf',
        '.ufo',
        '.eps',
        '.ai,raw',
        '.WMF',
        '.webp',
        '.avif',
        '.apng',
      ].includes(path.extname(fsUri.fsPath))
    )
      return;

    return new vscode.Hover(
      new vscode.MarkdownString(`
![${path.basename(fsUri.fsPath)}](${fsUri}|width=200)
[${path.basename(fsUri.fsPath)}](${fsUri})\n
    `)
    );
  }
}

const imagePreviewProvider = new ImagePreviewProvider();

export default imagePreviewProvider;
