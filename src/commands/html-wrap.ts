import { getConfig } from '@/utils';
import { SnippetString, window } from 'vscode';

export default function htmlWrap() {
  const { document, selection, insertSnippet } = window.activeTextEditor!;

  const text = document.getText(selection).replaceAll('$', '\\$').replaceAll('  ', ' ');

  insertSnippet(new SnippetString(`<\${1|${getConfig('htmlTag').join(',')}|} $2>\n\t${text}\n</$1>`));
}
