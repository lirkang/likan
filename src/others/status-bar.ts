import { formatSize } from '@/utils';
import { statSync } from 'fs';
import { freemem, totalmem } from 'os';
import { StatusBarAlignment, window, workspace } from 'vscode';

type Align = 'left' | 'right';

const alignment: { [key in Align]: StatusBarAlignment } = {
  left: StatusBarAlignment.Left,
  right: StatusBarAlignment.Right,
};

function create(id: string, command: string | undefined, text: string, tooltip: string, align: Align, priority = 0) {
  const statusBarItem = window.createStatusBarItem(id, alignment[align], priority);

  statusBarItem.command = command;
  statusBarItem.text = text;
  statusBarItem.tooltip = tooltip;

  return statusBarItem;
}

export const fileSize = create('likan-file-size', undefined, '', '', 'right', 101);
export const mem = create('likan-mem', undefined, '', '', 'right', 102);
export const terminal = create('likan-terminal', 'likan.terminalToggle', 'Terminal', '', 'left', 103);

fileSize.show();
mem.show();
terminal.show();

setInterval(() => {
  mem.text = `${formatSize(totalmem() - freemem(), false)} / ${formatSize(totalmem())}`;

  mem.show();
}, 5000);

function updateConfig() {
  const filename = window.activeTextEditor?.document.fileName;

  if (filename) {
    fileSize.text = `$(file-code) ${formatSize(statSync(filename).size)}`;
    fileSize.show();
  } else fileSize.hide();
}

window.onDidChangeActiveTextEditor(updateConfig);
workspace.onDidSaveTextDocument(updateConfig);
