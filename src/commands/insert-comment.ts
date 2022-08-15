import { SnippetString, window } from 'vscode';

import { POSITION } from '@/constants';
import { getDocComment } from '@/utils';

export default function insertComment() {
  window.activeTextEditor!.insertSnippet(
    new SnippetString(getDocComment(window.activeTextEditor!.document.uri)),
    POSITION
  );
}
