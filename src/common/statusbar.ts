/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @Filepath likan/src/common/statusbar.ts
 */

import { format } from 'date-fns';
import { freemem, platform, totalmem } from 'node:os';
import numeral from 'numeral';

import StatusBarItem from '@/classes/StatusBarItem';

import { DATE_FORMAT } from './constants';
import { exists, toNormalizePath } from './utils';

export const fileSize = new StatusBarItem<FileSizeUpdaterParameters>(
  'FILE_SIZE',
  StatusBarItem.Right,
  101,
  '$(file-code)',
);

export const memory = new StatusBarItem('MEMORY', StatusBarItem.Right, 102);

fileSize.onConfigChanged = bool => fileSize.update(vscode.window.activeTextEditor?.document, bool);
memory.onConfigChanged = memory.setVisible;

fileSize.update = async (document = vscode.window.activeTextEditor?.document, condition = Configuration.FILE_SIZE) => {
  if (!document) return fileSize.resetState();

  const uri = document instanceof vscode.Uri ? document : document.uri;

  if (!exists(uri) || uri.scheme !== 'file') return fileSize.resetState();
  if (condition !== undefined) fileSize.setVisible(condition);

  try {
    const { size, ctime, mtime } = await vscode.workspace.fs.stat(uri);
    const command = vscode.Uri.parse('command:revealFileInOS');
    const contents = [
      `[${toNormalizePath(uri)}](${command})`,
      `- 文件大小 \`${numeral(size).format('0.[000] b')}\``,
      `- 创建时间 \`${format(ctime, DATE_FORMAT)}\``,
      `- 修改时间 \`${format(mtime, DATE_FORMAT)}\``,
    ];
    const content = new vscode.MarkdownString(contents.join('\n'));

    content.isTrusted = true;
    content.supportThemeIcons = true;

    fileSize
      .setText(numeral(size).format('0.[00] b'))
      .setTooltip(content)
      .setCommand({ arguments: [], command: 'revealFileInOS', title: '打开文件' });
  } catch {
    fileSize.resetState();
  }
};

memory.update = (() => {
  function update () {
    const total = totalmem();
    const free = freemem();
    const contents = [
      `- 比例 \`${numeral((total - free) / total).format('0.[00] %')}\``,
      `- 空闲 \`${numeral(free).format('0.[0000] b')}\``,
      `- 已用 \`${numeral(total - free).format('0.[0000] b')}\``,
      `- 总量 \`${numeral(total).format('0.[0000] b')}\``,
    ];
    const content = new vscode.MarkdownString(contents.join('\n'));

    content.isTrusted = true;
    content.supportThemeIcons = true;

    memory
      .setVisible(Configuration.MEMORY)
      .setText(`${numeral(total - free).format('0.[00] b')} / ${numeral(total).format('0.[00] b')}`)
      .setTooltip(content);
  }

  setInterval(update, 5000);

  return update;
})();

if (platform() === 'win32')
  memory.setCommand({
    arguments: [ undefined, [ 'taskmgr' ], undefined, false, true, true ],
    command: 'likan.other.scriptRunner',
    title: '打开任务管理器',
  });
