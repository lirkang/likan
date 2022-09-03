/**
 * @Author likan
 * @Date 2022/8/15 23:03:49
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\javascript.ts
 */

import {
  /*   CLOSED_TAG,
   */ EMPTY_STRING,
  ENV_FILES,
  JAVASCRIPT_PATH,
  JSON_PATH,
  LINKED_EDITING_PATTERN,
  NODE_MODULES,
  PACKAGE_JSON,
  POSITION,
  UNDEFINED,
} from '@/constants';
import {
  getConfig,
  getKeys,
  getRootPath,
  getTargetFilePath,
  removeMatchedStringAtStartAndEnd,
  toFirstUpper,
  verifyExistAndNotDirectory,
} from '@/utils';

export class EnvironmentProvider implements vscode.CompletionItemProvider {
  #envProperties: Array<vscode.CompletionItem> = [];
  #rootPath = EMPTY_STRING;

  #getEnvProperties() {
    for (const environment of ENV_FILES) {
      const filepath = path.join(this.#rootPath, environment);

      if (verifyExistAndNotDirectory(filepath)) {
        const fileData = fs.readFileSync(filepath, 'utf8');

        if (fileData.trim()) {
          for (let s of fileData.split('\n')) {
            s = s.trim();

            const indexof = s.indexOf('=');

            if (indexof !== -1 && !s.startsWith('#')) {
              this.#envProperties.push({
                detail: s.slice(indexof + 1, s.length).trim(),
                documentation: toFirstUpper(path.join(this.#rootPath, environment)),
                kind: vscode.CompletionItemKind.Property,
                label: s.slice(0, indexof).trim(),
              });
            }
          }
        }
      }
    }
  }

  #init() {
    this.#envProperties = [];
    this.#rootPath = EMPTY_STRING;
  }

  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const rootPath = getRootPath();
    const word = document.lineAt(position).text.slice(0, Math.max(0, position.character)).trim();

    if (!rootPath) return;

    if (word.endsWith('process.env.') || word.endsWith("process.env['")) {
      this.#rootPath = rootPath;

      this.#getEnvProperties();

      return new vscode.CompletionList(this.#envProperties);
    }
  }
}

export class JumpProvider implements vscode.DefinitionProvider {
  #word = EMPTY_STRING;
  #rootPath = EMPTY_STRING;
  #locations: Array<vscode.Location> = [];

  set locations(fsPath: string | undefined) {
    if (!fsPath || !verifyExistAndNotDirectory(fsPath)) return;

    this.#locations.push(new vscode.Location(vscode.Uri.file(fsPath), POSITION));
  }

  #getRelativePathDefinition() {
    if (!vscode.window.activeTextEditor) return;

    const { fsPath } = vscode.window.activeTextEditor.document.uri;

    this.locations = getTargetFilePath(path.dirname(fsPath), this.#word);
  }

  #getAbsolutePathDefinition() {
    this.locations = getTargetFilePath(this.#word);
  }

  #getAliasPathDefinition() {
    const aliasMap = getConfig('alias');

    for (const a of getKeys(aliasMap)) {
      if (this.#word.startsWith(a) && ['/', UNDEFINED].includes(this.#word.replace(a, EMPTY_STRING)[0])) {
        let rootPath = this.#rootPath;
        const word = this.#word.replace(a, EMPTY_STRING);

        if (aliasMap[a].startsWith('${root}')) {
          rootPath += aliasMap[a].replace('${root}', EMPTY_STRING);

          this.locations = getTargetFilePath(path.join(rootPath, word));
        } else {
          rootPath += aliasMap[a];

          this.locations = getTargetFilePath(path.join(rootPath, word));
        }
      }
    }
  }

  #getPackageJsonDefinition() {
    if (JSON_PATH.test(this.#word)) {
      const filepath = path.join(this.#rootPath, NODE_MODULES, this.#word);

      const target = getTargetFilePath(filepath);
      const manifest = path.join(filepath, PACKAGE_JSON);

      this.locations = manifest;
      this.locations = target;
    }
  }

  #init() {
    this.#locations = [];
    this.#rootPath = EMPTY_STRING;
    this.#word = EMPTY_STRING;
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const word = document.getText(document.getWordRangeAtPosition(position, JAVASCRIPT_PATH));
    const rootPath = getRootPath();

    this.#word = removeMatchedStringAtStartAndEnd(word);

    if (rootPath) {
      this.#rootPath = rootPath;
      this.#getAliasPathDefinition();
      this.#getPackageJsonDefinition();
    }

    this.#getRelativePathDefinition();
    this.#getAbsolutePathDefinition();

    return this.#locations;
  }
}

export class LinkedEditingProvider implements vscode.LinkedEditingRangeProvider {
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

      this.#startTagRange = new vscode.Range(new vscode.Position(line, character - this.#tag.length), position);

      this.#documentToEnd = document.getText(
        new vscode.Range(
          position,
          new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).range.end.character)
        )
      );
      this.#direction = 'end';

      this.#findAtBackward(position);
    } else if (EndTagReg.test(text.trim())) {
      this.#tag = text.trim().replace(EndTagReg, '$1');

      this.#endTagRange = new vscode.Range(new vscode.Position(line, character - this.#tag.length), position);

      this.#documentToStart = document.getText(
        new vscode.Range(POSITION, new vscode.Position(line, character - this.#tag.length))
      );
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
            new vscode.Position(line - index, indexOf + 1),
            new vscode.Position(line - index, flag ? indexOf + 1 : indexOf + tag.length)
          );

          this.#matchedTagRanges.push(range);

          if (this.#sameTagCount === 0) {
            throw UNDEFINED;
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
            new vscode.Position(index + line, positionCharacter),
            new vscode.Position(
              index + line,
              flag ? positionCharacter : (index === 0 ? character : 0) + indexOf + tag.length
            )
          );

          this.#matchedTagRanges.push(range);

          if (this.#sameTagCount === 0) {
            throw UNDEFINED;
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
    this.#tag = UNDEFINED;
    this.#startTagRange = UNDEFINED;
    this.#endTagRange = UNDEFINED;
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
