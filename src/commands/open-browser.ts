import { exec } from 'child_process';
import { Uri } from 'vscode';

export default function openBrowser({ fsPath }: Uri) {
  exec(`start ${fsPath}`);
}
