/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @FilePath D:\CodeSpace\Dev\likan\src\common\listeners.ts
 */

import { isEqual } from 'lodash-es';
import { freemem, totalmem } from 'node:os';
import normalizePath from 'normalize-path';

import { EMPTY_STRING, LANGUAGES, VOID } from './constants';
import { fileSize, memory } from './statusbar';
import { exist, formatSize, getConfig, toFirstUpper } from './utils';

/(["'`])(?<!\\)(["'`])*\1/;

export async function updateFileSize(
  document: vscode.Uri | vscode.TextDocument | undefined = vscode.window.activeTextEditor?.document,
  condition: boolean = getConfig('fileSize')
) {
  if (!document) return fileSize.setVisible(false);

  const uri = document instanceof vscode.Uri ? document : document.uri;

  if (!exist(uri)) return fileSize.setVisible(false);

  if (condition !== VOID) fileSize.setVisible(condition);

  const { size } = await vscode.workspace.fs.stat(uri);

  fileSize.setText(formatSize(size));
  fileSize.setTooltip(toFirstUpper(normalizePath(uri.fsPath) ?? EMPTY_STRING));
  fileSize.setCommand({ arguments: [uri], command: 'revealFileInOS', title: '打开文件' });
}

export async function updateMemory() {
  memory.setVisible(getConfig('memory'));
  memory.setText(`${formatSize(totalmem() - freemem(), false)} / ${formatSize(totalmem())}`);
  memory.setTooltip(`${(((totalmem() - freemem()) / totalmem()) * 100).toFixed(2)} %`);
}

export const changeEditor = vscode.window.onDidChangeActiveTextEditor(async textEditor => {
  if (!textEditor) return fileSize.setVisible(false);

  const { document, edit } = textEditor;
  const { uri, getText, lineCount, lineAt, languageId } = document;
  const condition = exist(uri) && getConfig('fileSize');

  updateFileSize(document, condition);

  if (!getConfig('comment') || !LANGUAGES.includes(languageId)) return;

  const fullDocumentRange = new vscode.Range(0, 0, lineCount - 1, lineAt(lineCount - 1).range.end.character);
  const documentString = getText(fullDocumentRange);

  if (/(^\s+$)|(^$)/.test(documentString)) {
    await edit(editor => editor.delete(fullDocumentRange));
    await vscode.commands.executeCommand('likan.language.comment', textEditor);
  }
});

export const changeConfig = vscode.workspace.onDidChangeConfiguration(() => {
  const config = getConfig();

  updateFileSize(vscode.window.activeTextEditor?.document, config.fileSize);
  memory.setVisible(config.memory);
});

export const changeTextEditor = vscode.workspace.onDidChangeTextDocument(
  async ({ document: { languageId, uri, lineAt, getWordRangeAtPosition, getText }, contentChanges, reason }) => {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor || !isEqual(uri, activeTextEditor.document.uri)) return;

    updateFileSize(uri, getConfig('fileSize'));

    if (![...LANGUAGES, 'vue'].includes(languageId) || reason) return;

    {
      const { selections, selection, edit } = activeTextEditor;
      const { active, start } = selection;
      const frontPosition = active.isAfter(start) ? start : active;

      const { text } = lineAt(frontPosition.line);
      const frontText = text.slice(0, Math.max(0, frontPosition.character));
      const textRange = getWordRangeAtPosition(frontPosition, /(["'`]).*\1/);
      const fullString = getText(textRange);
      const insertText = contentChanges
        .map(({ text }) => text)
        .reverse()
        .join('');

      if (selections.length > 1 || !textRange || !/(?!>\\)\$$/.test(frontText) || !/^{.*}$/.test(insertText)) return;

      {
        const { start, end } = textRange;

        await edit(editor => {
          editor.replace(new vscode.Range(end.translate(VOID, -1), end), '`');
          editor.replace(new vscode.Range(start, start.translate(VOID, 1)), '`');

          if (/`+/g.test(fullString.slice(1, -1))) {
            editor.replace(
              new vscode.Range(start.translate(VOID, 1), end.translate(VOID, -1)),
              fullString.slice(1, -1).replaceAll(/\\*`/g, string => {
                const [preString, postString] = [string.slice(0, -1), string.slice(-1)];

                return preString.length % 2 === 0 ? `${preString}\\${postString}` : string;
              })
            );
          }
        });
      }
    }
  }
);

export const Timer = setInterval(updateMemory, 2000);
