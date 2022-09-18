/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @FilePath D:\CodeSpace\Dev\likan\src\common\listeners.ts
 */

import { freemem, totalmem } from 'node:os';

import { LANGUAGES, VOID } from './constants';
import { fileSize, memory } from './statusbar';
import { exist, formatSize, getConfig, toNormalizePath } from './utils';

export async function updateFileSize(
  document: vscode.Uri | vscode.TextDocument | undefined = vscode.window.activeTextEditor?.document,
  condition: boolean = getConfig('fileSize')
) {
  if (!document) return fileSize.resetState();

  const uri = document instanceof vscode.Uri ? document : document.uri;

  if (!exist(uri)) return fileSize.resetState();
  if (condition !== VOID) fileSize.setVisible(condition);

  try {
    const { size } = await vscode.workspace.fs.stat(uri);

    fileSize.setText(formatSize(size));
    fileSize.setTooltip(toNormalizePath(uri));
    fileSize.setCommand({ arguments: [uri], command: 'revealFileInOS', title: '打开文件' });
  } catch {
    fileSize.resetState();
  }
}

export async function updateMemory() {
  const total = totalmem();
  const free = freemem();

  memory.setVisible(getConfig('memory'));
  memory.setText(`${formatSize(total - free, false)} / ${formatSize(total)}`);
  memory.setTooltip(`${(((total - free) / total) * 100).toFixed(2)} %`);
}

export const changeEditor = vscode.window.onDidChangeActiveTextEditor(async textEditor => {
  if (!textEditor) return fileSize.setVisible(false);

  const { document, edit } = textEditor;
  const { uri, getText, lineCount, lineAt, languageId } = document;
  const condition = exist(uri) && getConfig('fileSize');

  updateFileSize(document, condition);

  if (!getConfig('comment') || !LANGUAGES.includes(languageId)) return;

  const fullDocumentRange = new vscode.Range(0, 0, lineCount - 1, lineAt(lineCount - 1).range.end.character);
  const fullDocumentText = getText(fullDocumentRange);

  if (/(^\s+$)|(^$)/.test(fullDocumentText)) {
    await edit(editor => editor.delete(fullDocumentRange), { undoStopAfter: false, undoStopBefore: false });
    await vscode.commands.executeCommand('likan.language.comment', textEditor);
  } else {
    const front20Text = fullDocumentText.split('\n').slice(0, 20);

    for await (const [index, string] of front20Text.entries()) {
      if (!/^\s\*\s@(Filepath)|(Author)|(Date)|(FilePath)/.test(string)) continue;

      const [key, value] = string
        .replace(/^\s\*\s@(\w+)\s(.*)/, '$1 $2')
        .split(' ')
        .map(string => string.trim());
      const { author } = getConfig();

      if (key === 'Author') {
        if (author !== value) {
          await edit(editor => {
            editor.replace(lineAt(index).range, ` * @Author ${author}`);
          });
        }
      } else if (['Filepath', 'FilePath'].includes(key)) {
        const normalizeUriPath = toNormalizePath(uri);

        if (value !== normalizeUriPath) {
          await edit(editor => {
            editor.replace(lineAt(index).range, ` * @Filepath ${normalizeUriPath}`);
          });
        }
      }
    }
  }
});

export const changeConfig = vscode.workspace.onDidChangeConfiguration(() => {
  const config = getConfig();

  updateFileSize(vscode.window.activeTextEditor?.document, config.fileSize);
  memory.setVisible(config.memory);
});

export const changeTextEditor = vscode.workspace.onDidChangeTextDocument(
  async ({
    document: { languageId, uri, lineAt, getWordRangeAtPosition, getText, lineCount },
    contentChanges,
    reason,
  }) => {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor || uri !== activeTextEditor.document.uri) return;

    updateFileSize(uri, getConfig('fileSize'));

    if (![...LANGUAGES, 'vue'].includes(languageId) || reason) return;

    {
      const { selections, selection, edit } = activeTextEditor;
      const { active, start } = selection;
      const frontPosition = active.isAfter(start) ? start : active;
      const { text } = lineAt(frontPosition.line > lineCount - 1 ? lineCount - 1 : frontPosition.line);

      const frontText = text.slice(0, Math.max(0, frontPosition.character));
      const textRange = getWordRangeAtPosition(frontPosition, /(["']).*?((?<!\\)\1)/);
      const fullString = getText(textRange);
      const matched = frontText.match(/(\\*\$)$/);
      const insertText = contentChanges.map(({ text }) => text).reverse();

      if (selections.length > 1 || !matched || !textRange || !/^{.*}$/.test(insertText.join(''))) return;

      const [matchedString] = matched;

      if (matchedString.split('$')[0].length % 2 !== 0) return;

      {
        const { start, end } = textRange;

        await edit(
          editor => {
            editor.replace(new vscode.Range(end.translate(0, -1), end), '`');
            editor.replace(new vscode.Range(start, start.translate(0, 1)), '`');

            if (/`+/g.test(fullString.slice(1, -1))) {
              editor.replace(
                new vscode.Range(start.translate(0, 1), end.translate(0, -1)),
                fullString.slice(1, -1).replaceAll(/\\*`/g, string => {
                  const [preString, postString] = [string.slice(0, -1), string.slice(-1)];

                  return preString.length % 2 === 0 ? `${preString}\\${postString}` : string;
                })
              );
            }
          },
          { undoStopAfter: false, undoStopBefore: false }
        );
      }
    }
  }
);

export const Timer = setInterval(updateMemory, 2000);
