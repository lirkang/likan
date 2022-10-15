/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @Filepath likan/src/common/statusbar.ts
 */

import { format } from 'date-fns';
import { freemem, platform, totalmem } from 'node:os';

import StatusBarItem from '@/classes/StatusBarItem';

import { DATE_FORMAT } from './constants';
import { exists, formatSize, toNormalizePath } from './utils';

export const fileSize = new StatusBarItem<[uri?: vscode.Uri | vscode.TextDocument, condition?: boolean]>(
  'fileSize',
  vscode.StatusBarAlignment.Right,
  101,
  '$(file-code)'
);

export const memory = new StatusBarItem('memory', vscode.StatusBarAlignment.Right, 102);

fileSize.onConfigChanged(bool => fileSize.update(vscode.window.activeTextEditor?.document, bool));
memory.onConfigChanged(memory.setVisible);

fileSize.update = async (document = vscode.window.activeTextEditor?.document,
  condition = Configuration.fileSize) => {
  if (!document)
    return fileSize.resetState();

  const uri = document instanceof vscode.Uri ? document : document.uri;

  if (!exists(uri) || uri.scheme !== 'file')
    return fileSize.resetState();
  if (condition !== undefined)
    fileSize.setVisible(condition);

  try {
    const { size, ctime, mtime } = await vscode.workspace.fs.stat(uri);
    const command = vscode.Uri.parse('command:revealFileInOS');
    const contents = [
      `[${toNormalizePath(uri)}](${command})`,
      `- 文件大小 \`${formatSize(size, true, 6, 'default')}\``,
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
};

memory.update = () => {
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
    .setVisible(Configuration.memory)
    .setText(`${formatSize(total - free, false)} / ${formatSize(total, undefined, undefined, 'simple')}`)
    .setTooltip(content);
};

if (platform() === 'win32') {
  memory.setCommand({
    arguments: [undefined, ['taskmgr'], undefined, false, true, true],
    command: 'likan.other.scriptRunner',
    title: '打开任务管理器',
  });
}

setInterval(memory.update, 5000);
