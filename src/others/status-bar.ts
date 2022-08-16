import { statSync } from 'fs';
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
export const terminal = create('likan-terminal', 'likan.statusbar.terminal', 'Terminal', EMPTY_STRING, 'left', 103);

fileSize.show();
mem.show();
terminal.show();

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

  if (getConfig('terminal')) {
    terminal.show();
  } else {
    terminal.hide();
  }
}

vscode.workspace.onDidChangeConfiguration(updateConfig);

vscode.window.onDidChangeActiveTextEditor(e => {
  if (!e || !getConfig('fileSize')) return fileSize.hide();

  const { size } = statSync(e.document.fileName);

  fileSize.text = `$(file-code) ${formatSize(size)}`;
  fileSize.show();
});

vscode.workspace.onDidSaveTextDocument(({ fileName }) => {
  if (!getConfig('fileSize')) return fileSize.hide();

  const { size } = statSync(fileName);

  fileSize.text = `$(file-code) ${formatSize(size)}`;
  fileSize.show();
});
