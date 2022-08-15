/**
 * @Author likan
 * @Date 2022/8/15 23:03:58
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\json.ts
 */

import { existsSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { DefinitionProvider, Location, Position, TextDocument, Uri } from 'vscode';

import { EMPTY_STRING, NODE_MODULES, PACKAGE_JSON, POSITION } from '@/constants';

export class LanguageDepsDefinitionProvider implements DefinitionProvider {
  provideDefinition(document: TextDocument, position: Position) {
    const word = document.getText(document.getWordRangeAtPosition(position));

    const targetDir = join(dirname(document.fileName), NODE_MODULES, word.replaceAll('"', EMPTY_STRING), PACKAGE_JSON);

    if (existsSync(targetDir) && !statSync(targetDir).isDirectory()) return new Location(Uri.file(targetDir), POSITION);
  }
}
