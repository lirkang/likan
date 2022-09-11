/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @FilePath E:\WorkSpace\likan\src\others\statusbar.ts
 */

import StatusBar from '@/classes/StatusBar';

import { FALSE, TRUE, UNDEFINED } from './constants';

export const fileSize = new StatusBar(vscode.StatusBarAlignment.Right, 101, '$(file-code)');
export const memory = new StatusBar(vscode.StatusBarAlignment.Right, 102 /* , '$(dashboard)' */);

if (os.platform() === 'win32') {
  memory.setCommand({
    arguments: [['taskmgr'], UNDEFINED, FALSE, TRUE],
    command: 'likan.other.scriptRunner',
    title: '打开文件',
  });
}

const statusbarItems = [fileSize.statusBarItem, memory.statusBarItem] as const;

export default statusbarItems;
