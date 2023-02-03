/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @Filepath likan/src/common/statusbar.ts
 */

import { format } from 'date-fns';
import { freemem, platform, totalmem } from 'node:os';
import numeral from 'numeral';

import StatusBarItem from '@/classes/StatusBarItem';
import { DATE_FORMAT } from '@/common/constants';

import { exist, toNormalizePath } from './utils';

const fileSize = new StatusBarItem<[uri?: vscode.Uri]>(StatusBarItem.Right, 101, '$(file-code)');
const memory = new StatusBarItem(StatusBarItem.Right, 102);

class _MarkdownString extends vscode.MarkdownString {
  constructor (value: string | Array<string>) {
    super(typeof value === 'string' ? value : value.join('\n'));

    super.isTrusted = true;
    super.supportThemeIcons = true;
    super.supportHtml = true;
  }
}

fileSize.update = async function fileSizeUpdate () {
  const uri = vscode.window.activeTextEditor?.document.uri;

  if (!Configuration.FILE_SIZE || !uri || !exist(uri)) return fileSize.resetState();
  else fileSize.setVisible(true);

  try {
    const { size, ctime, mtime } = await vscode.workspace.fs.stat(uri);
    const command = vscode.Uri.parse('command:revealFileInOS');
    const contents = [
      `[${toNormalizePath(uri)}](${command})`,
      `- 文件大小 \`${numeral(size).format('0.[000] b')}\``,
      `- 创建时间 \`${format(ctime, DATE_FORMAT)}\``,
      `- 修改时间 \`${format(mtime, DATE_FORMAT)}\``,
    ];

    fileSize
      .setText(numeral(size).format('0.[00] b'))
      .setTooltip(new _MarkdownString(contents))
      .setCommand({ arguments: [], command: 'revealFileInOS', title: 'Open file' });
  } catch {
    fileSize.resetState();
  }
};

memory.update = function memoryUpdate () {
  if (!Configuration.MEMORY) return memory.resetState();

  const freeMemB = freemem();
  const totalMemB = totalmem();
  const usedMemB = totalMemB - freeMemB;

  const content = [
    `- 比例 \`${numeral(usedMemB / totalMemB).format('0.[00] %')}\``,
    `- 空闲 \`${numeral(freeMemB).format('0.[0000] b')}\``,
    `- 已用 \`${numeral(usedMemB).format('0.[0000] b')}\``,
    `- 总量 \`${numeral(totalMemB).format('0.[0000] b')}\``,
  ];

  const texts = [ numeral(usedMemB).format('0.[00] b'), '/', numeral(totalMemB).format('0.[00] b') ];

  memory.setText(texts.join(' ')).setTooltip(new _MarkdownString(content)).setVisible(true);
};

setInterval(memory.update, 3000);

if (platform() === 'win32')
  memory.setCommand({
    arguments: [ undefined, [ 'taskmgr' ], undefined, false, true, true ],
    command: 'likan.other.scriptRunner',
    title: '打开任务管理器',
  });

export { fileSize, memory };
