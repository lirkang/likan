/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @Filepath likan/src/common/statusbar.ts
 */

import { freemem, platform, totalmem } from 'node:os';

import StatusBarItem from '@/classes/StatusBarItem';

import { exist, formatDate, formatSize, toNormalizePath } from './utils';

const fileSize = new StatusBarItem<[uri?: vscode.Uri]>(StatusBarItem.Right, 101);
const memory = new StatusBarItem(StatusBarItem.Right, 102);

class _MarkdownString extends vscode.MarkdownString {
  constructor(value: string | Array<string>) {
    super(typeof value === 'string' ? value : value.join('\n'));

    super.isTrusted = true;
    super.supportThemeIcons = true;
    super.supportHtml = true;
  }
}

fileSize.update = async function fileSizeUpdate() {
  const uri = vscode.window.activeTextEditor?.document.uri;

  if (!Configuration.FILE_SIZE || !uri || !exist(uri)) return fileSize.resetState();
  else fileSize.setVisible(true);

  try {
    const { size, ctime, mtime } = await vscode.workspace.fs.stat(uri);
    const command = vscode.Uri.parse('command:revealFileInOS');
    const contents = [
      `[${toNormalizePath(uri)}](${command})`,
      `- 文件大小 \`${formatSize(size, 4)}\``,
      `- 创建时间 \`${formatDate(ctime)}\``,
      `- 修改时间 \`${formatDate(mtime)}\``,
    ];

    fileSize
      .setText(formatSize(size))
      .setTooltip(new _MarkdownString(contents))
      .setCommand({ arguments: [], command: 'revealFileInOS', title: 'Open file' });
  } catch {
    fileSize.resetState();
  }
};

memory.update = function memoryUpdate() {
  if (!Configuration.MEMORY) return memory.resetState();

  const freeMemB = freemem();
  const totalMemB = totalmem();
  const usedMemB = totalMemB - freeMemB;

  const content = [
    `- 比例 \`${((usedMemB / totalMemB) * 100).toFixed(2).replace(/0+$/, '')} %\``,
    `- 空闲 \`${formatSize(freeMemB)}\``,
    `- 已用 \`${formatSize(usedMemB)}\``,
    `- 总量 \`${formatSize(totalMemB)}\``,
  ];

  memory
    .setText(`${formatSize(usedMemB, undefined, true)} / ${formatSize(totalMemB)}`)
    .setTooltip(new _MarkdownString(content))
    .setVisible(true);
};

setInterval(memory.update, 3000);

if (platform() === 'win32')
  memory.setCommand({
    arguments: [undefined, ['taskmgr'], undefined, false, true, true],
    command: 'likan.other.scriptRunner',
    title: '打开任务管理器',
  });

export { fileSize, memory };
