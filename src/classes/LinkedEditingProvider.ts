/**
 * @Author likan
 * @Date 2022/09/03 09:07:36
 * @FilePath D:\CodeSpace\Dev\likan\src\class\LinkedEditingProvider.ts
 */

import { EMPTY_STRING, LINKED_EDITING_PATTERN, VOID } from '@/common/constants';

class LinkedEditingProvider implements vscode.LinkedEditingRangeProvider {
  #startTagRange?: vscode.Range;
  #endTagRange?: vscode.Range;
  #tag?: string;
  #documentToStart = EMPTY_STRING;
  #documentToEnd = EMPTY_STRING;
  #matchedTagRanges: Array<vscode.Range> = [];
  #sameTagCount = 0;
  #direction: 'start' | 'end' = 'start';

  #matchTag(document: vscode.TextDocument, position: vscode.Position) {
    const { character, line } = position;

    const text = document.lineAt(position).text.slice(0, Math.max(0, character));
    const StartTagReg = /.*<([\w$.-]*)$/;
    const EndTagReg = /.*<\/([\w$.-]*)$/;

    if (StartTagReg.test(text)) {
      this.#tag = text.trim().replace(StartTagReg, '$1');

      // const tenLineDocument = document.getText(
      //   new vscode.Range(
      //     new vscode.Position(line, character - this.#tag.length - 1),
      //     new vscode.Position(line + 10, document.lineAt(line + 10).range.end.character)
      //   )
      // );

      // if (new RegExp(`^<${this.#tag}${CLOSED_TAG}`).test(tenLineDocument)) {
      //   return;
      // }

      this.#startTagRange = new vscode.Range(line, character - this.#tag.length, line, character);

      this.#documentToEnd = document.getText(
        new vscode.Range(
          line,
          character,
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).range.end.character
        )
      );
      this.#direction = 'end';

      this.#findAtBackward(position);
    } else if (EndTagReg.test(text.trim())) {
      this.#tag = text.trim().replace(EndTagReg, '$1');

      this.#endTagRange = new vscode.Range(line, character - this.#tag.length, line, character);

      this.#documentToStart = document.getText(new vscode.Range(0, 0, line, character - this.#tag.length));
      this.#direction = 'start';

      this.#findAtForward(position);
    }
  }

  #findAtForward({ line }: vscode.Position) {
    const flag = this.#tag === EMPTY_STRING;
    const tag = flag ? '<>' : `<${this.#tag}`;
    const startReg = flag ? new RegExp('^.*</>.*') : new RegExp(`^.*</${this.#tag?.replaceAll('.', '\\.')}.*`);
    const endReg = new RegExp(`^.*${tag.replaceAll('.', '\\.')}.*`);

    try {
      for (const [index, t] of this.#documentToStart.split('\n').reverse().entries()) {
        if (startReg.test(t)) {
          this.#sameTagCount++;
        }

        if ((flag ? /.*(<$)|(<\s?>.*)|(<\s.*)/ : endReg).test(t)) {
          const indexOf = /.*(<$)|(<\s.*)/.test(t) ? t.indexOf('<') : t.indexOf(tag);

          const range = new vscode.Range(
            line - index,
            indexOf + 1,
            line - index,
            flag ? indexOf + 1 : indexOf + tag.length
          );

          this.#matchedTagRanges.push(range);

          if (this.#sameTagCount === 0) {
            throw VOID;
          } else {
            this.#sameTagCount--;
            this.#matchedTagRanges.shift();
          }
        }
      }
    } catch {
      //
    }
  }

  #findAtBackward({ character, line }: vscode.Position) {
    const flag = this.#tag === EMPTY_STRING;
    const tag = flag ? '</>' : `</${this.#tag}`;
    const startReg = flag ? new RegExp('^.*<>.*') : new RegExp(`^.*<${this.#tag?.replaceAll('.', '\\.')}.*`);
    const endReg = new RegExp(`^.*${tag.replaceAll('.', '\\.')}.*`);

    try {
      for (const [index, t] of this.#documentToEnd.split('\n').entries()) {
        if (startReg.test(t)) {
          this.#sameTagCount++;
        }

        if (endReg.test(t)) {
          const indexOf = t.indexOf(tag);
          const positionCharacter = (index === 0 ? character : 0) + indexOf + 2;

          const range = new vscode.Range(
            index + line,
            positionCharacter,
            index + line,
            flag ? positionCharacter : (index === 0 ? character : 0) + indexOf + tag.length
          );

          this.#matchedTagRanges.push(range);

          if (this.#sameTagCount === 0) {
            throw VOID;
          } else {
            this.#sameTagCount--;
            this.#matchedTagRanges.shift();
          }
        }
      }
    } catch {
      //
    }
  }

  #setFinalRange() {
    if (this.#direction === 'start') {
      this.#startTagRange = this.#matchedTagRanges[this.#sameTagCount];
    } else {
      this.#endTagRange = this.#matchedTagRanges[this.#sameTagCount];
    }
  }

  #init() {
    this.#tag = VOID;
    this.#startTagRange = VOID;
    this.#endTagRange = VOID;
    this.#matchedTagRanges = [];
    this.#direction = 'start';
    this.#documentToStart = EMPTY_STRING;
    this.#documentToEnd = EMPTY_STRING;
    this.#sameTagCount = 0;
  }

  provideLinkedEditingRanges(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();
    this.#matchTag(document, position);
    this.#setFinalRange();

    if (this.#endTagRange && this.#startTagRange) {
      return new vscode.LinkedEditingRanges([this.#startTagRange, this.#endTagRange], LINKED_EDITING_PATTERN);
    }
  }
}

const linkedEditingProvider = new LinkedEditingProvider();

export default linkedEditingProvider;
