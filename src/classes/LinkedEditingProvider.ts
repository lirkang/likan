/**
 * @Author likan
 * @Date 2022-12-16 17:48:37
 * @Filepath likan/src/classes/LinkedEditingProvider.ts
 */

const OPEN_TAG_REGEXP = /<(?<tagname>[\w.-]*)$/;
const CLOSE_TAG_REGEXP = /<\/(?<tagname>[\w.-]*)$/;

class _LinkedEditingProvider implements vscode.LinkedEditingRangeProvider {
  private _countChar (char: string, targetChar: Array<string>) {
    let counter = 0;

    for (const c of char) if (targetChar.includes(c)) counter += 1;

    return counter;
  }

  private _openTagProgress (tagname: string, document: vscode.TextDocument, position: vscode.Position) {
    const behindDocument = document.getText(new vscode.Range(position, new vscode.Position(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)));
    const matches = behindDocument.matchAll(new RegExp(tagname, 'g'));
    const nextResult: IteratorResult<RegExpMatchArray, RegExpMatchArray> = matches.next();
    let counter = 0;

    while (nextResult.done === false) {
      const { index, input } = nextResult.value;

      if (!index || !input) continue;

      const isCloseTag = input[index - 1] === '/';
      const texts = input.slice(0, index - (isCloseTag ? 2 : 1));

      if (!isCloseTag) counter += 1;
      else if (counter !== 0) counter -= 1;
      else {
        const line = position.line + this._countChar(texts, [ '\n' ]);
        const character = 1;

        return new vscode.LinkedEditingRanges([]);
      }
    }
  }

  private _closeTagProgress (tagname: string, document: vscode.TextDocument, position: vscode.Position) {
    const frontDocument = document.getText(new vscode.Range(new vscode.Position(0, 0), position.translate(0, -tagname.length - 2)));
    const matches = frontDocument.matchAll(new RegExp(tagname, 'g'));

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
