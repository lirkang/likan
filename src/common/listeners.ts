/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @Filepath likan/src/common/listeners.ts
 */

import { parse } from 'comment-parser';
import { format } from 'date-fns';
import { freemem, totalmem } from 'node:os';

import Editor from '@/classes/Editor';

import { DATE_FORMAT, LANGUAGES } from './constants';
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
    const command = vscode.Uri.parse('command:revealFileInOS');
    const contents = [
      `[${toNormalizePath(uri)}](${command})`,
      `- 创建时间 \`${format(ctime, DATE_FORMAT)}\``,
      `- 修改时间 \`${format(mtime, DATE_FORMAT)}\``,
    ];
    const content = new vscode.MarkdownString(contents.join('\n'));

    content.isTrusted = true;
    content.supportThemeIcons = true;

    fileSize
      .setText(formatSize(size, undefined, undefined, 'simple'))
      .setTooltip(content)
      .setCommand({ arguments: [], command: 'revealFileInOS', title: '打开文件' });
  } catch {
    fileSize.resetState();
  }
}

export async function updateMemory() {
  const total = totalmem();
  const free = freemem();

  const contents = [
    `- 比例 \`${(((total - free) / total) * 100).toFixed(2)} %\``,
    `- 空闲 \`${formatSize(free)}\``,
    `- 已用 \`${formatSize(total - free)}\``,
    `- 总量 \`${formatSize(total)}\``,
  ];
  const content = new vscode.MarkdownString(contents.join('\n'));

  content.isTrusted = true;
  content.supportThemeIcons = true;

  memory
    .setVisible(getConfig('memory'))
    .setText(`${formatSize(total - free, false)} / ${formatSize(total, undefined, undefined, 'simple')}`)
    .setTooltip(content);
}

export const changeEditor = vscode.window.onDidChangeActiveTextEditor(async textEditor => {
  if (!textEditor) return updateFileSize(undefined, false);

  const { fileSize, comment } = getConfig();
  const { uri, getText, lineCount, lineAt, languageId } = textEditor.document;
  const condition = exist(uri) && fileSize;

  updateFileSize(uri, condition);

  if (!comment || !LANGUAGES.includes(languageId)) return;

  const range = new vscode.Range(0, 0, lineCount - 1, lineAt(lineCount - 1).range.end.character);
  const documentText = getText(range);
  const parsedDocument = parse(documentText);
  const { source, tags } = parsedDocument[0] ?? {};

  if ([documentText.trim(), parsedDocument].some(({ length = 0 }) => length === 0)) {
    await vscode.commands.executeCommand('likan.language.comment', textEditor);
  } else if ([source, tags].some(({ length = 0 }) => length > 0)) {
    for await (const [index, { number }] of source.entries()) {
      const { name, tag } = tags[index] ?? {};

      if (!/(filepath)|(filename)/i.test(tag)) continue;

      const relativePath = vscode.workspace.asRelativePath(uri, true);

      if (name !== relativePath) {
        await new Editor(uri).replace(lineAt(number + 1).range, ` * @Filepath ${relativePath}`).done();
      }

      break;
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

    const insideStringRegexp = /(["'](?=[^"'])).*?((?<!\\)\1)/;
    const outsideStringRegexp = /(["']).*?((?<!\\)\1)/;

    const insertText = contentChanges.map(({ text }) => text).reverse();
    const { selections, selection } = activeTextEditor;
    const { start, isEmpty } = selection;
    const { text } = lineAt(start.line > lineCount - 1 ? lineCount - 1 : start.line);
    const frontText = text.slice(0, Math.max(0, start.character));
    const textRange = getWordRangeAtPosition(start, outsideStringRegexp);
    const matchedText = getText(textRange);
    const matchedTextWithoutQuote = matchedText.slice(1, -1);
    const matched = frontText.match(/(\\*\$)$/);

    if (selections.length > 1 || !matched || !textRange || !/^{.*}$/.test(insertText.join(''))) return;
    if (matched[0].split('$')[0].length % 2 !== 0) return;

    const editor = new Editor(uri);

    editor.replace(new vscode.Range(textRange.end.translate(0, -1), textRange.end), '`');
    editor.replace(new vscode.Range(textRange.start, textRange.start.translate(0, 1)), '`');
    let counter = 0;

    if (/`+/g.test(matchedTextWithoutQuote)) {
      editor.replace(
        new vscode.Range(textRange.start.translate(0, 1), textRange.end.translate(0, -1)),
        matchedTextWithoutQuote.replaceAll(/\\*`/g, (string, index: number) => {
          const preString = string.slice(0, -1);
          const condition = preString.length % 2 === 0;

          if (condition) {
            if (index < start.character - textRange.start.character) counter++;

            return `${preString}\\\``;
          } else {
            return string;
          }
        })
      );
    }

    await editor.done();

    if (!isEmpty) return;

    activeTextEditor.selection = new vscode.Selection(start.translate(0, counter + 1), start.translate(0, counter + 1));
  }
);

export const Timer = setInterval(updateMemory, 5000);
