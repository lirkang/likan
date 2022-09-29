/**
 * @Author likan
 * @Date 2022/09/03 09:07:36
 * @Filepath likan/src/classes/LinkedEditingProvider.ts
 */

class LinkedEditingProvider implements vscode.LinkedEditingRangeProvider {
  #tag = '';
  #rangeStack: Array<vscode.Range> = [];
  #direction?: 'left' | 'right';

  #init(document: vscode.TextDocument, position: vscode.Position) {
    this.#rangeStack = [];
    this.#tag = '';
    this.#direction = undefined;
    this.#rangeStack = [];

    const [tagname, direction] = this.#getTag(document, position);
    if (!tagname) return;

    this.#tag = tagname;
    this.#direction = direction;
  }

  #getTag(document: vscode.TextDocument, position: vscode.Position): [string | undefined, 'left' | 'right'] | [false] {
    const { text } = document.lineAt(position.line);
    const cursorLeftText = text.slice(0, Math.max(0, position.character));

    const matched = cursorLeftText.match(/<(?<tagname>[\w.\-]+)$/);
    const matchedSelfClosing = cursorLeftText.match(/<\/(?<tagname>[\w.\-]+)$/);
    const tagname = matched ? matched.groups?.tagname : matchedSelfClosing?.groups?.tagname;
    const direction = matched ? 'right' : 'left';

    if (!tagname) return [false];

    return this.#verifySelfClosingTag(document, position, tagname, direction) ? [false] : [tagname, direction];
  }

  #verifySelfClosingTag(
    document: vscode.TextDocument,
    position: vscode.Position,
    tagname: string,
    direction: 'left' | 'right'
  ) {
    if (direction === 'left') return false;

    const rangeToEnd = new vscode.Range(
      position.line,
      position.character - tagname.length - 1,
      document.lineCount - 1,
      document.lineAt(document.lineCount - 1).range.end.character
    );
    const documentToEnd = document.getText(rangeToEnd);
    const regExp = new RegExp(`^<(${tagname}).*?>.*?<\\/\\s?\\1\\s?>`, 's');
    const matched = documentToEnd.match(regExp);

    if (matched) {
      const [matchedString] = matched;
      const regExp = new RegExp(
        `^<${tagname}\\s*(?::?[\\w$\\-]+(?:=(?:(?:(?<quote>["'\`]).*?\\k<quote>)))?)*?\\s*\\/>`,
        // `^<${tagname}\\s*(?::?[\\w$\\-]+(?:=(?:(?:(?<quote>["'\`]).*?\\k<quote>)|(?:{.*?})))?)*?\\s*\\/>`,
        's'
      );

      return regExp.test(matchedString);
    }

    return true;
  }

  #findRange(document: vscode.TextDocument, position: vscode.Position) {
    if (!this.#tag) return [false, false] as const;

    const ranges: [vscode.Range, vscode.Range] = [
      new vscode.Range(position.translate(0, -this.#tag.length), position),
      this.#searchRange(document, position, this.#tag),
    ];

    return this.#direction === 'left' ? <[vscode.Range, vscode.Range]>ranges.reverse() : ranges;
  }

  #searchRange(document: vscode.TextDocument, position: vscode.Position, tagname: string) {
    return (this.#direction === 'left' ? this.#searchInFront : this.#searchInBackward)(document, position, tagname);
  }

  #searchInFront(document: vscode.TextDocument, position: vscode.Position, tagname: string) {
    console.log('likan - LinkedEditingProvider.ts - line at 90 =>', tagname);

    const rangeToStart = new vscode.Range(0, 0, position.line, position.character - tagname.length - 1);
    const documentToStart = document.getText(rangeToStart);

    loop: for (const [index, lineText] of documentToStart.split('\n').reverse().entries()) {
      if (lineText.trim().length === 0) continue loop;

      this.#rangeStack.push();
    }

    return new vscode.Range(0, 0, 0, 1);
  }

  #searchInBackward(document: vscode.TextDocument, position: vscode.Position, tagname: string) {
    const rangeToEnd = new vscode.Range(
      position.line,
      position.character - tagname.length - 2,
      document.lineCount - 1,
      document.lineAt(document.lineCount - 1).range.end.character
    );
    const documentToEnd = document.getText(rangeToEnd);

    loop: for (const [index, lineText] of documentToEnd.split('\n').entries()) {
      if (lineText.trim().length === 0) continue loop;

      this.#rangeStack.push();
    }

    return new vscode.Range(0, 0, 0, 1);
  }

  provideLinkedEditingRanges(document: vscode.TextDocument, position: vscode.Position) {
    this.#init(document, position);

    const [start, end] = this.#findRange(document, position);

    if (start && end) {
      return new vscode.LinkedEditingRanges([start, end]);
    }
  }
}

const linkedEditingProvider = new LinkedEditingProvider();

export default linkedEditingProvider;
