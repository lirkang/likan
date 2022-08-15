import open = require('open');

import { Uri } from 'vscode';

export default function openBrowser({ fsPath }: Uri) {
  open(fsPath);
}
