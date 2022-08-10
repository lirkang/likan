import { exec } from 'child_process';
import { Uri } from 'vscode';

function openBrowser({ fsPath }: Uri) {
  exec(`start ${fsPath}`);
}

export { openBrowser };
