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
  condition = getConfig('fileSize')
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

const changeEditor = vscode.window.onDidChangeActiveTextEditor(async textEditor => {
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

const saveText = vscode.workspace.onDidSaveTextDocument(updateFileSize);

const changeConfig = vscode.workspace.onDidChangeConfiguration(() => {
  const config = getConfig();

  updateFileSize(vscode.window.activeTextEditor?.document, config.fileSize);
  memory.setVisible(config.memory);
});

export const Timer = setInterval(updateMemory, 2000);

const listeners = [changeConfig, changeEditor, saveText];

export default listeners;
