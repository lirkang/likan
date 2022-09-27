/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @Filepath likan/src/common/listeners.ts
 */

import { freemem, totalmem } from 'node:os';

import Editor from '@/classes/Editor';

import { LANGUAGES } from './constants';
import { fileSize, memory } from './statusbar';
import { exist, formatSize, getConfig, toNormalizePath } from './utils';

export async function updateFileSize(
  document: vscode.Uri | vscode.TextDocument | undefined = vscode.window.activeTextEditor?.document,
  condition: boolean = getConfig('fileSize')
) {
  if (!document) return fileSize.resetState();

  const uri = document instanceof vscode.Uri ? document : document.uri;

  if (!exist(uri)) return fileSize.resetState();
  if (condition !== undefined) fileSize.setVisible(condition);

  try {
    const { size, ctime, mtime } = await vscode.workspace.fs.stat(uri);
    const command = vscode.Uri.parse(`command:revealFileInOS?${encodeURIComponent(JSON.stringify([uri]))}`);
    const content = new vscode.MarkdownString(
      `[${toNormalizePath(uri)}](${command})\n
- 创建时间 \`${new Date(ctime).toLocaleString()}\`\n
- 修改时间 \`${new Date(mtime).toLocaleString()}\``
    );

    content.isTrusted = true;

    fileSize
      .setText(formatSize(size))
      .setTooltip(content)
      .setCommand({ arguments: [], command: 'revealFileInOS', title: '打开文件' });
  } catch {
    fileSize.resetState();
  }
}

export async function updateMemory() {
  const total = totalmem();
  const free = freemem();

  const content = new vscode.MarkdownString(
    `- 比例 \`${(((total - free) / total) * 100).toFixed(2)} %\`\n
- 空闲 \`${formatSize(free)}\`\n
- 已用 \`${formatSize(total - free)}\`\n
- 总量 \`${formatSize(total)}\``
  );
  content.isTrusted = true;

  memory
    .setVisible(getConfig('memory'))
    .setText(`${formatSize(total - free, false)} / ${formatSize(total)}`)
    .setTooltip(content);
}

export const changeEditor = vscode.window.onDidChangeActiveTextEditor(async textEditor => {
  if (!textEditor) return fileSize.setVisible(false);

  const { uri, getText, lineCount, lineAt, languageId } = textEditor.document;
  const condition = exist(uri) && getConfig('fileSize');
  const editor = new Editor(uri);

  updateFileSize(uri, condition);

  if (!getConfig('comment') || !LANGUAGES.includes(languageId)) return;

  const fullDocumentRange = new vscode.Range(0, 0, lineCount - 1, lineAt(lineCount - 1).range.end.character);
  const fullDocumentText = getText(fullDocumentRange);

  if (/(^\s+$)|(^$)/.test(fullDocumentText)) {
    await vscode.commands.executeCommand('likan.language.comment', textEditor);
  } else {
    const front20Text = fullDocumentText.split('\n').slice(0, 20);

    for await (const [index, string] of front20Text.entries()) {
      if (!/^\s\*\s@(Filepath)|(Filename)|(FilePath)/.test(string)) continue;
      const execResult = /^\s\*\s@(?<key>\w+)\s(?<value>.*)/.exec(string);

      if (!execResult?.groups) continue;

      const { value } = execResult.groups;
      const relativePath = vscode.workspace.asRelativePath(uri, true);

      if (value !== relativePath) editor.replace(lineAt(index).range, ` * @Filepath ${relativePath}`);

      break;
    }
  }

  editor.done();
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

    const insertText = contentChanges.map(({ text }) => text).reverse();
    const { selections, selection } = activeTextEditor;
    const { end, start } = selection;
    const frontPosition = end.isAfter(start) ? start : end;
    const { text } = lineAt(frontPosition.line > lineCount - 1 ? lineCount - 1 : frontPosition.line);
    const frontText = text.slice(0, Math.max(0, frontPosition.character));
    const textRange = getWordRangeAtPosition(frontPosition, /["']*?(["']).*?((?<!\\)\1)/);
    const matchedText = getText(textRange);
    const matched = frontText.match(/(\\*\$)$/);

    if (selections.length > 1 || !matched || !textRange || !/^{.*}$/.test(insertText.join(''))) return;
    if (matched[0].split('$')[0].length % 2 !== 0) return;

    const editor = new Editor(uri);

    editor.replace(new vscode.Range(textRange.end.translate(0, -1), textRange.end), '`');
    editor.replace(new vscode.Range(textRange.start, textRange.start.translate(0, 1)), '`');

    if (/`+/g.test(matchedText.slice(1, -1))) {
      editor.replace(
        new vscode.Range(textRange.start.translate(0, 1), textRange.end.translate(0, -1)),
        matchedText.slice(1, -1).replaceAll(/\\*`/g, string => {
          const [preString, postString] = [string.slice(0, -1), string.slice(-1)];

          return preString.length % 2 === 0 ? `${preString}\\${postString}` : string;
        })
      );
    }

    editor.done();
  }
);

export const Timer = setInterval(updateMemory, 2000);
