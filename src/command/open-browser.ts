import { exec } from 'child_process';
import { window } from 'vscode';

function openBrowser() {
  const filename = window.activeTextEditor?.document.fileName;

  if (!filename) return;

  exec(`start file://${filename}`);
}

export { openBrowser };
