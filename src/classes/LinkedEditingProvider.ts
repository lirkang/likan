/**
 * @Author likan
 * @Date 2022-12-16 17:48:37
 * @Filepath likan/src/classes/LinkedEditingProvider.ts
 */

const OPEN_TAG_REGEXP = /<(?<tagname>[\w.-]*)$/;
const CLOSE_TAG_REGEXP = /<\/(?<tagname>[\w.-]*)$/;

class _LinkedEditingProvider implements vscode.LinkedEditingRangeProvider {
  private _openTagProgress (tagname: string, document: vscode.TextDocument, position: vscode.Position) {
    const behindDocument = document.getText(new vscode.Range(position, new vscode.Position(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)));

    return new vscode.LinkedEditingRanges([]);
  }

  private _closeTagProgress (tagname: string, document: vscode.TextDocument, position: vscode.Position) {
    const frontDocument = document.getText(new vscode.Range(new vscode.Position(0, 0), position.translate(0, -tagname.length - 2)));

    return new vscode.LinkedEditingRanges([]);
  }

  provideLinkedEditingRanges (document: vscode.TextDocument, position: vscode.Position) {
    const lineText = document.lineAt(position.line).text.slice(0, position.character);

    const openTagMatch = lineText.match(OPEN_TAG_REGEXP);
    const closeTagMatch = lineText.match(CLOSE_TAG_REGEXP);

    try {
      if (openTagMatch?.groups) return this._openTagProgress(openTagMatch.groups.tagname, document, position);
      if (closeTagMatch?.groups) return this._closeTagProgress(closeTagMatch.groups.tagname, document, position);
    } catch (error) {
      console.log('[LinkedEditingProvider.ts: 37]', error);
    }
  }
}

const linkedEditingProvider = new _LinkedEditingProvider();

export default linkedEditingProvider;
