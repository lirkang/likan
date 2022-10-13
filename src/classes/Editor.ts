/**
 * @Author likan
 * @Date 2022-09-25 16:36:46
 * @Filepath likan/src/classes/Editor.ts
 * @Description
 */

import { URI } from 'vscode-uri';

export default class Editor extends vscode.Disposable {
  #edit = new vscode.WorkspaceEdit();
  #uri: vscode.Uri;
  #done = false;
  #error = new Error('Edit is already applied!');

  constructor(uri: vscode.Uri | vscode.TextDocument) {
    super(() => (this.#done = true));
    this.#uri = uri instanceof vscode.Uri ? uri : uri.uri;

    if (!URI.isUri(this.#uri)) {
      throw new Error('Invalid uri!');
    }
  }

  insert(position: vscode.Position, newText: string): this;
  insert(positions: Array<vscode.Position>, newTexts: Array<string>): this;
  insert(positions: Array<vscode.Position>, newText: string): this;
  insert(line: number, character: number, newText: string): this;

  insert(
    first: vscode.Position | Array<vscode.Position> | number,
    second: string | Array<string> | number,
    third?: string
  ) {
    if (this.checkIfDone()) {
      throw this.#error;
    }

    if (first instanceof vscode.Position) {
      this.#edit.insert(this.#uri, first, <string>second);
    } else if (Array.isArray(first)) {
      for (const [index, position] of first.entries()) {
        this.#edit.insert(this.#uri, position, Array.isArray(second) ? second[index] : <string>second);
      }
    } else if (typeof first === 'number') {
      this.#edit.insert(this.#uri, new vscode.Position(first, <number>second), <string>third);
    }

    return this;
  }

  delete(range: vscode.Range): this;
  delete(ranges: Array<vscode.Range>): this;
  delete(startLine: number, startCharacter: number, endLine: number, endCharacter: number): this;

  delete(first: vscode.Range | Array<vscode.Range> | number, second?: number, third?: number, fourth?: number) {
    if (this.checkIfDone()) {
      throw this.#error;
    }

    if (Array.isArray(first)) {
      for (const range of first) {
        this.#edit.delete(this.#uri, range);
      }
    } else if (typeof first === 'number') {
      this.#edit.delete(this.#uri, new vscode.Range(first, <number>second, <number>third, <number>fourth));
    } else {
      this.#edit.delete(this.#uri, first);
    }

    return this;
  }

  replace(ranges: vscode.Range, newTexts: string): this;
  replace(ranges: Array<vscode.Range>, newTexts: Array<string> | string): this;
  replace(startPosition: vscode.Position, endPosition: vscode.Position, newText: string): this;
  replace(startLine: number, startCharacter: number, endLine: number, endCharacter: number, newText: string): this;
  replace(
    positions: Array<[startPosition: vscode.Position, endPosition: vscode.Position]>,
    newText: Array<string> | string
  ): this;

  replace(
    first: vscode.Range | Array<vscode.Range> | vscode.Position | number | Array<[vscode.Position, vscode.Position]>,
    second: string | Array<string> | vscode.Position | number,
    third?: number | string,
    fourth?: number,
    fifth?: string
  ) {
    if (this.checkIfDone()) {
      throw this.#error;
    }

    if (first instanceof vscode.Range) {
      this.delete(first);
      this.insert(first.start, <string>second);
    } else if (Array.isArray(first)) {
      for (const [index, item] of first.entries()) {
        const range = Array.isArray(item) ? new vscode.Range(...item) : item;

        this.delete(range);
        this.insert(range.start, Array.isArray(second) ? second[index] : <string>second);
      }
    } else if (first instanceof vscode.Position) {
      this.delete(new vscode.Range(first, <vscode.Position>second));
      this.insert(first, <string>third);
    } else if (typeof first === 'number') {
      this.delete(new vscode.Range(first, <number>second, <number>third, <number>fourth));
      this.insert(first, <number>second, <string>fifth);
    }

    return this;
  }

  checkIfDone() {
    return this.#done;
  }

  async done() {
    if (this.checkIfDone()) {
      throw this.#error;
    }

    return (this.#done = await vscode.workspace.applyEdit(this.#edit));
  }
}
