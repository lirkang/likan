import { getConfig } from '@/utils';
import { SnippetString, window } from 'vscode';

export default function htmlWrap() {
  const { htmlTag } = getConfig();

  const activeTextEditor = window.activeTextEditor;

  if (!activeTextEditor) return;

  const { document, selection } = activeTextEditor;

  const text = document.getText(selection).replace(/\$/g, '\\$').replace(/  /g, ' ');

  activeTextEditor.insertSnippet(new SnippetString(`<\${1|${htmlTag.join(',')}|} $2>\n\t${text}\n</$1>`));
}
