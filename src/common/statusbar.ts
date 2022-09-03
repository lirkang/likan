/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @FilePath E:\WorkSpace\likan\src\others\statusbar.ts
 */

import StatusBar from '@/classes/StatusBar';

export const fileSize = new StatusBar(vscode.StatusBarAlignment.Right, 101, '$(file-code)');
export const memory = new StatusBar(vscode.StatusBarAlignment.Right, 102);

const statusbarItems = [fileSize.statusBarItem, memory.statusBarItem] as const;

export default statusbarItems;
