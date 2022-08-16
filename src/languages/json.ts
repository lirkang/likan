/**
 * @Author likan
 * @Date 2022/8/15 23:03:58
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\json.ts
 */

import { existsSync, statSync } from 'fs';
import { dirname, join } from 'path';

import { EMPTY_STRING, NODE_MODULES, PACKAGE_JSON, POSITION } from '@/constants';

export class LanguageDepsDefinitionProvider implements vscode.DefinitionProvider {
  #getDir(fileName: string, word: string) {
    return join(dirname(fileName), NODE_MODULES, word.replaceAll('"', EMPTY_STRING), PACKAGE_JSON);
  }

  #verifyCanJumpTo(path: string) {
    if (existsSync(path) && !statSync(path).isDirectory()) return new vscode.Location(vscode.Uri.file(path), POSITION);
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    console.log(document);

    const word = document.getText(document.getWordRangeAtPosition(position));

    const targetDir = this.#getDir(document.uri.fsPath, word);

    const canJumpTo = this.#verifyCanJumpTo(targetDir);

    if (canJumpTo) return canJumpTo;
  }
}
