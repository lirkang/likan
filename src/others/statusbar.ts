/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @FilePath E:\WorkSpace\likan\src\others\statusbar.ts
 */

import { freemem, totalmem } from 'os';

import { EMPTY_STRING, FALSE, UNDEFINED } from '@/constants';
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

export const fileSize = create('likan-file-size', UNDEFINED, EMPTY_STRING, EMPTY_STRING, 'right', 101);
export const mem = create('likan-mem', UNDEFINED, EMPTY_STRING, EMPTY_STRING, 'right', 102);

fileSize.show();
mem.show();

setInterval(() => {
  mem.text = `${formatSize(totalmem() - freemem(), FALSE)} / ${formatSize(totalmem())}`;
}, 5000);

vscode.workspace.onDidChangeConfiguration(() => {
  const fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;

  if (getConfig('fileSize') && fsPath && fs.existsSync(fsPath)) {
    fileSize.show();
  } else {
    fileSize.hide();
  }

  if (getConfig('memory')) {
    mem.show();
  } else {
    mem.hide();
  }
});

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
