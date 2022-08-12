import { getConfig } from '@/utils';
import { SnippetString, window } from 'vscode';

export default function htmlWrap() {
  const { htmlTag } = getConfig();

  const activeTextEditor = window.activeTextEditor;

  if (!activeTextEditor) return;

  const { document, selection } = activeTextEditor;

  const text = document.getText(selection).replace(/\$/g, r => `\\${r}`);

  activeTextEditor.insertSnippet(new SnippetString(`<\${1|${htmlTag.join(',')}|}>\n\t${text}\n</$1>`));
}
