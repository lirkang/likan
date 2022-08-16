import { getConfig } from '@/utils';

export default function htmlWrap() {
  const { document, selection, insertSnippet } = vscode.window.activeTextEditor!;

  const text = document.getText(selection).replaceAll('$', '\\$').replaceAll('  ', ' ');

  insertSnippet(new vscode.SnippetString(`<\${1|${getConfig('htmlTag').join(',')}|} $2>\n\t${text}\n</$1>`));
}
