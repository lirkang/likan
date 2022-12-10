/**
 * @Author likan
 * @Date 2022-09-25 16:36:46
 * @Filepath likan/src/classes/Editor.ts
 * @Description
 */

export default class Editor implements vscode.Disposable {
  private _edit = new vscode.WorkspaceEdit();

  constructor (private _uri: vscode.Uri) {}

  // TODO: 销毁自己
  public dispose () {}

  insert(position: vscode.Position, newText: string): this;

  insert(positions: Array<vscode.Position>, newTexts: Array<string>): this;

  insert(positions: Array<vscode.Position>, newText: string): this;

  insert(line: number, character: number, newText: string): this;

  public insert (
    first: vscode.Position | Array<vscode.Position> | number,
    second: string | Array<string> | number,
    third?: string,
  ) {
    if (first instanceof vscode.Position) this._edit.insert(this._uri, first, <string>second);
    else if (Array.isArray(first))
      for (const [ index, position ] of first.entries())
        this._edit.insert(this._uri, position, Array.isArray(second) ? second[index] : <string>second);
    else if (typeof first === 'number')
      this._edit.insert(this._uri, new vscode.Position(first, <number>second), <string>third);

    return this;
  }

  delete(range: vscode.Range): this;

  delete(ranges: Array<vscode.Range>): this;

  delete(startLine: number, startCharacter: number, endLine: number, endCharacter: number): this;

  public delete (first: vscode.Range | Array<vscode.Range> | number, second?: number, third?: number, fourth?: number) {
    if (Array.isArray(first)) for (const range of first) this._edit.delete(this._uri, range);
    else if (typeof first === 'number')
      this._edit.delete(this._uri, new vscode.Range(first, <number>second, <number>third, <number>fourth));
    else this._edit.delete(this._uri, first);

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

  public replace (
    first: vscode.Range | Array<vscode.Range> | vscode.Position | number | Array<[vscode.Position, vscode.Position]>,
    second: string | Array<string> | vscode.Position | number,
    third?: number | string,
    fourth?: number,
    fifth?: string,
  ) {
    if (first instanceof vscode.Range) {
      this.delete(first);
      this.insert(first.start, <string>second);
    } else if (Array.isArray(first))
      for (const [ index, item ] of first.entries()) {
        const range = Array.isArray(item) ? new vscode.Range(...item) : item;

        this.delete(range);
        this.insert(range.start, Array.isArray(second) ? second[index] : <string>second);
      }
    else if (first instanceof vscode.Position) {
      this.delete(new vscode.Range(first, <vscode.Position>second));
      this.insert(first, <string>third);
    } else if (typeof first === 'number') {
      this.delete(new vscode.Range(first, <number>second, <number>third, <number>fourth));
      this.insert(first, <number>second, <string>fifth);
    }

    return this;
  }

  public async apply () {
    await vscode.workspace.applyEdit(this._edit);

    this.dispose();
  }
}
