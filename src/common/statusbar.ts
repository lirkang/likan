/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @Filepath src/common/statusbar.ts
 */

import { platform } from 'node:os';

import StatusBar from '@/classes/StatusBar';

import { VOID } from './constants';
export const fileSize = new StatusBar(vscode.StatusBarAlignment.Right, 101, '$(file-code)');
export const memory = new StatusBar(vscode.StatusBarAlignment.Right, 102);

if (platform() === 'win32') {
  memory.setCommand({
    arguments: [VOID, ['taskmgr'], VOID, false, true, true],
    command: 'likan.other.scriptRunner',
    title: '打开任务管理器',
  });
}
