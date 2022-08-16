/**
 * @Author likan
 * @Date 2022/8/15 23:03:58
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\json.ts
 */

import { EMPTY_STRING, NODE_MODULES, PACKAGE_JSON, POSITION } from '@/constants';
import { verifyExistAndNotDirectory } from '@/utils';

export class LanguageDepsDefinitionProvider implements vscode.DefinitionProvider {
  #getDir(fileName: string, word: string) {
    return path.join(path.dirname(fileName), NODE_MODULES, word.replaceAll('"', EMPTY_STRING), PACKAGE_JSON);
  }

  #verifyCanJumpTo(filepath: string) {
    if (verifyExistAndNotDirectory(filepath)) return new vscode.Location(vscode.Uri.file(filepath), POSITION);
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
    const word = document.getText(document.getWordRangeAtPosition(position));

    const targetDir = this.#getDir(document.uri.fsPath, word);

    const canJumpTo = this.#verifyCanJumpTo(targetDir);

    if (canJumpTo) return canJumpTo;
  }
}
