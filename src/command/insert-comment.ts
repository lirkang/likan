import { getDocComment } from '@/utils';
import { Position, SnippetString, window } from 'vscode';

export default function insertComment() {
  window.activeTextEditor?.insertSnippet(
    new SnippetString(getDocComment(window.activeTextEditor.document.uri)),
    new Position(0, 0)
  );
}
