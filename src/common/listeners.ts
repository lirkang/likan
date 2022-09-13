/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @FilePath D:\CodeSpace\Dev\likan\src\common\listeners.ts
 */

import normalizePath from 'normalize-path';
import { Utils } from 'vscode-uri';

import { DOC_COMMENT_EXT, EMPTY_STRING, POSITION, VOID } from './constants';
import { fileSize, memory } from './statusbar';
import { exist, formatSize, getConfig, getDocumentCommentSnippet, toFirstUpper } from './utils';

export async function updateFileSize(
  document = vscode.window.activeTextEditor?.document,
  condition: boolean = getConfig('fileSize')
) {
  if (!document || !exist(document.uri)) return fileSize.setVisible(false);
  if (condition !== VOID) fileSize.setVisible(condition);

  const { uri } = document;
  const { size } = await vscode.workspace.fs.stat(uri);

  fileSize.setText(formatSize(size));
  fileSize.setTooltip(toFirstUpper(normalizePath(uri.fsPath) ?? EMPTY_STRING));
  fileSize.setCommand({ arguments: [uri], command: 'revealFileInOS', title: '打开文件' });
}

export async function updateMemory() {
  const totalmem = os.totalmem();
  const freemem = os.freemem();

  memory.setVisible(getConfig('memory'));
  memory.setText(`${formatSize(totalmem - freemem, false)} / ${formatSize(totalmem)}`);
  memory.setTooltip(`${(((totalmem - freemem) / totalmem) * 100).toFixed(2)} %`);
}

export const changeEditor = vscode.window.onDidChangeActiveTextEditor(async textEditor => {
  if (!textEditor) return fileSize.setVisible(false);

  const { document, edit, insertSnippet } = textEditor;
  const { uri, getText, lineCount, lineAt } = document;
  const suffix = Utils.extname(uri);
  const condition = exist(uri) && getConfig('fileSize');

  updateFileSize(document, condition);

  if (!getConfig('comment') || !DOC_COMMENT_EXT.includes(suffix)) return;

  const fullDocumentRange = new vscode.Range(0, 0, lineCount - 1, lineAt(lineCount - 1).range.end.character);
  const documentString = getText(fullDocumentRange);

  if (/(^\s+$)|(^$)/.test(documentString)) {
    await edit(editor => editor.delete(fullDocumentRange));
    insertSnippet(getDocumentCommentSnippet(uri), POSITION);
  }
});

export const saveText = vscode.workspace.onDidSaveTextDocument(updateFileSize);

export const changeConfig = vscode.workspace.onDidChangeConfiguration(() => {
  const config = getConfig();

  updateFileSize(vscode.window.activeTextEditor?.document, config.fileSize);
  memory.setVisible(config.memory);
});

export const changeTextEditor = vscode.workspace.onDidChangeTextDocument(({ document, contentChanges, reason }) => {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) return;
  if (document.uri.fsPath !== activeTextEditor.document.uri.fsPath) return;

  {
    const { document, selections, selection, edit } = activeTextEditor;

    if (selections.length > 1) return;

    edit(editor => {
      editor.replace;
    });
  }
});

export const Timer = setInterval(updateMemory, 2000);

function insertBracket(
  editor: vscode.TextEditorEdit,
  startPosition: vscode.Position,
  endPosition: vscode.Position,
  restSelections: Array<vscode.Selection>
) {
  editor.insert(startPosition, '{');
  editor.insert(endPosition, '}');

  const selection = new vscode.Selection(startPosition.translate(VOID, 1), endPosition.translate(VOID, 1));

  restSelections.push(selection);
}

export default async function convertString() {
  if (!vscode.window.activeTextEditor) return;

  const restSelections: Array<vscode.Selection> = [];
  const { document, edit, selection, selections } = vscode.window.activeTextEditor;
  const { isEmpty, isSingleLine, active, start, end } = selection;

  if (!isEmpty || !isSingleLine || selections.length > 1) {
    edit(editor => {
      for (let index = 0; index < selections.length; index++) {
        const { selections } = vscode.window.activeTextEditor!;
        const { start, end } = selections[index];

        insertBracket(editor, start, end, restSelections);

        vscode.window.activeTextEditor!.selections = [...restSelections, ...selections.slice(index + 1)];
      }
    });
  } else {
    const textRange = document.getWordRangeAtPosition(active, /["'`].*["'`]/);
    const text = document.getText(textRange);
    const beforeText = document.lineAt(active).text.slice(0, Math.max(0, active.character));
    const conditions = [!text, !textRange, !beforeText.endsWith('$'), /^`.*`$/.test(text)];

    if (!conditions.some(Boolean)) {
      await edit(async editor => {
        editor.replace(new vscode.Range(textRange!.start, textRange!.start.translate(0, 1)), '`');
        editor.replace(new vscode.Range(textRange!.end.translate(0, -1), textRange!.end), '`');

        insertBracket(editor, start, end, restSelections);
      });
    } else {
      1;
      await edit(editor => insertBracket(editor, start, end, restSelections));
    }
  }

  vscode.window.activeTextEditor.selections = restSelections;
}
