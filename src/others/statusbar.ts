/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @FilePath E:\WorkSpace\likan\src\others\statusbar.ts
 */

import { freemem, totalmem } from 'os';

import { EMPTY_STRING } from '@/constants';
import { formatSize, getConfig } from '@/utils';

const alignment: Record<Align, vscode.StatusBarAlignment> = {
  left: vscode.StatusBarAlignment.Left,
  right: vscode.StatusBarAlignment.Right,
};

function create(id: string, command: string | undefined, text: string, tooltip: string, align: Align, priority = 0) {
  const statusBarItem = vscode.window.createStatusBarItem(id, alignment[align], priority);

  statusBarItem.command = command;
  statusBarItem.text = text;
  statusBarItem.tooltip = tooltip;

  return statusBarItem;
}

export const fileSize = create('likan-file-size', void 0, EMPTY_STRING, EMPTY_STRING, 'right', 101);
export const mem = create('likan-mem', void 0, EMPTY_STRING, EMPTY_STRING, 'right', 102);

fileSize.show();
mem.show();

setInterval(() => {
  mem.text = `${formatSize(totalmem() - freemem(), false)} / ${formatSize(totalmem())}`;
}, 5000);

function updateConfig() {
  if (getConfig('fileSize')) {
    if (vscode.window.activeTextEditor) {
      fileSize.show();
    }
  } else {
    fileSize.hide();
  }

  if (getConfig('memory')) {
    mem.show();
  } else {
    mem.hide();
  }
}

vscode.workspace.onDidChangeConfiguration(updateConfig);

vscode.window.onDidChangeActiveTextEditor(e => {
  if (!e || !getConfig('fileSize')) return fileSize.hide();

  const { size } = fs.statSync(e.document.fileName);

  fileSize.text = `$(file-code) ${formatSize(size)}`;
  fileSize.show();
});

vscode.workspace.onDidSaveTextDocument(({ fileName }) => {
  if (!getConfig('fileSize')) return fileSize.hide();

  const { size } = fs.statSync(fileName);

  fileSize.text = `$(file-code) ${formatSize(size)}`;
  fileSize.show();
});
