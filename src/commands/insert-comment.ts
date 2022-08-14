import { POSITION } from '@/constants';
import { getDocComment } from '@/utils';
import { SnippetString, window } from 'vscode';

export default function insertComment() {
  window.activeTextEditor!.insertSnippet(
    new SnippetString(getDocComment(window.activeTextEditor!.document.uri)),
    POSITION
  );
}
