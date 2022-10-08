/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @Filepath likan/src/common/statusbar.ts
 */

import { format } from 'date-fns';
import { freemem, platform, totalmem } from 'node:os';

import StatusBar from '@/classes/StatusBar';

import { DATE_FORMAT } from './constants';
import { exist, formatSize, getConfig, toNormalizePath } from './utils';

export const fileSize = new StatusBar<[(vscode.Uri | vscode.TextDocument | undefined)?, boolean?]>(
  vscode.StatusBarAlignment.Right,
101,
'$(file-code)'
);
export const memory = new StatusBar(vscode.StatusBarAlignment.Right, 102);

fileSize.updater = async function (
  document = vscode.window.activeTextEditor?.document,
  condition = getConfig('fileSize')
) {
  if (!document) return this.resetState();

  const uri = document instanceof vscode.Uri ? document : document.uri;

  if (!exist(uri)) return this.resetState();
  if (condition !== undefined) this.setVisible(condition);

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

    this.setText(formatSize(size, undefined, undefined, 'simple'))
      .setTooltip(content)
      .setCommand({ arguments: [], command: 'revealFileInOS', title: '打开文件' });
  } catch {
    this.resetState();
  }
};

memory.updater = function () {
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

  this.setVisible(getConfig('memory'))
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
