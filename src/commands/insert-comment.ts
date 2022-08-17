import { POSITION } from '@/constants';
import { getDocComment } from '@/utils';

export default function insertComment() {
  if (!vscode.window.activeTextEditor) return;

  vscode.window.activeTextEditor.insertSnippet(
    new vscode.SnippetString(getDocComment(vscode.window.activeTextEditor.document.uri)),
    POSITION
  );
}
