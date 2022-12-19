/**
 * @Author likan
 * @Date 2022-12-19 18:04:47
 * @Filepath likan/src/commands/insert-text.ts
 */

import Editor from '@/classes/Editor';

export default function insertText (uri: vscode.Uri, positions: Array<vscode.Position>, text: string) {
  return new Editor(uri).insert(positions, text).apply();
}
