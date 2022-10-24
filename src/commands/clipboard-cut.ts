/**
 * @Author likan
 * @Date 2022-10-24 11:47:13
 * @Filepath likan/src/commands/clipboard-cut.ts
 * @Description
 */

import Editor from '@/classes/Editor';

export default async function ClipboardCut ({ document, selection }:vscode.TextEditor) {
  const textLine = document.lineAt(selection.start.line);

  await vscode.env.clipboard.writeText(document.getText(selection.isEmpty ? textLine.range : selection));
  await new Editor(document).delete(selection.isEmpty ? textLine.rangeIncludingLineBreak : selection).done();
}
