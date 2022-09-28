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

  insert(position: vscode.Position, newText: string) {
    if (this.checkIfDone()) {
      throw this.#error;
    }

    this.#edit.insert(this.#uri, position, newText);

    return this;
  }

  delete(range: vscode.Range) {
    if (this.checkIfDone()) {
      throw this.#error;
    }

    this.#edit.delete(this.#uri, range);

    return this;
  }

  replace(range: vscode.Range, newText: string) {
    if (this.checkIfDone()) {
      throw this.#error;
    }

    this.delete(range);
    this.insert(range.start, newText);

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
