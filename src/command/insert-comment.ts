import { toFirstUpper } from '@/utils';
import { Position, SnippetString, window } from 'vscode';

export default function insertComment() {
  window.activeTextEditor?.insertSnippet(
    new SnippetString(
      `/**
* @Author likan
* @Date ${new Date().toLocaleString()}
* @FilePath ${toFirstUpper(window.activeTextEditor?.document.fileName)}
*/\n\n`
    ),
    new Position(0, 0)
  );
}
