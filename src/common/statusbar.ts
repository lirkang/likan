/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @Filepath likan/src/common/statusbar.ts
 */

import { format } from 'date-fns';
import { map } from 'lodash-es';
import { cpu, mem, os } from 'node-os-utils';
import numeral from 'numeral';

import StatusBarItem from '@/classes/StatusBarItem';
import { DATE_FORMAT } from '@/common/constants';

import { exists, toNormalizePath } from './utils';

const fileSize = new StatusBarItem<FileSizeUpdater>(StatusBarItem.Right, 101, '$(file-code)');
const memory = new StatusBarItem(StatusBarItem.Right, 102);

fileSize.update = async (document = vscode.window.activeTextEditor?.document, condition = Configuration.FILE_SIZE) => {
  if (!document) return fileSize.resetState();

  const uri = document instanceof vscode.Uri ? document : document.uri;

  if (!exists(uri)) return fileSize.resetState();
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
  const update = async function update () {
    const [ totalMemMb, usedMemMb, freeMemMb ] = map(await mem.info(), value => value * 1000 ** 2);
    const cpuUsage = await cpu.usage(1000);

    const content = [
      `- CPU利用率 \`${numeral(cpuUsage / 100).format('0.[00] %')}\``,
      `- 比例 \`${numeral((totalMemMb - freeMemMb) / totalMemMb).format('0.[00] %')}\``,
      `- 空闲 \`${numeral(freeMemMb).format('0.[0000] b')}\``,
      `- 已用 \`${numeral(usedMemMb).format('0.[0000] b')}\``,
      `- 总量 \`${numeral(totalMemMb).format('0.[0000] b')}\``,
    ];
    const markdownString = new vscode.MarkdownString(content.join('\n'));

    markdownString.isTrusted = true;
    markdownString.supportThemeIcons = true;

    memory
      .setVisible(Configuration.MEMORY)
      .setText(`${numeral(usedMemMb).format('0.[00] b')} / ${numeral(totalMemMb).format('0.[00] b')}`)
      .setTooltip(markdownString);
  };

  setInterval(update, 2000);

  return update;
})();

if (os.platform() === 'win32')
  memory.setCommand({
    arguments: [ undefined, [ 'taskmgr' ], undefined, false, true, true ],
    command: 'likan.other.scriptRunner',
    title: '打开任务管理器',
  });

export { fileSize, memory };
