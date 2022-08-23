/**
 * @Author likan
 * @Date 2022/8/22 10:55:57
 * @FilePath E:\WorkSpace\likan\src\others\statusbar.ts
 */

import { freemem, totalmem } from 'os';

import { EMPTY_STRING } from '@/constants';
import { formatSize, getConfig, getRootPath } from '@/utils';

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

const rootPath = getRootPath() ?? EMPTY_STRING;

export const fileSize = create('likan-file-size', void 0, EMPTY_STRING, EMPTY_STRING, 'right', 101);
export const mem = create('likan-mem', void 0, EMPTY_STRING, EMPTY_STRING, 'right', 102);
export const projector = create(
  'likan-projector',
  'likan.open.workspace',
  `$(folder) ${path.basename(rootPath)}`,
  '打开项目',
  'left',
  0
);

fileSize.show();
mem.show();
projector.show();

setInterval(() => {
  mem.text = `${formatSize(totalmem() - freemem(), false)} / ${formatSize(totalmem())}`;
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

  const rootPath = getRootPath(e.document.uri.fsPath) ?? EMPTY_STRING;

  projector.text = `$(folder) ${path.basename(rootPath)}`;
});

vscode.workspace.onDidSaveTextDocument(({ fileName }) => {
  if (!getConfig('fileSize')) return fileSize.hide();

  const { size } = fs.statSync(fileName);

  fileSize.text = `$(file-code) ${formatSize(size)}`;
  fileSize.show();
});
