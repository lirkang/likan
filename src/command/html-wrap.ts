import { SnippetString, window } from 'vscode';

function htmlWrap() {
  const activeTextEditor = window.activeTextEditor;

  if (!activeTextEditor) return;

  const { document, selection } = activeTextEditor;

  const selectText = `<$1 >\n\t${document.getText(selection)}\n</>`;

  activeTextEditor.insertSnippet(new SnippetString(selectText));
}

export { htmlWrap };
