/**
 * @Author likan
 * @Date 2022/09/07 22:45:10
 * @Filepath likan/src/commands/package-script.ts
 */

import { Utils } from 'vscode-uri';

import scriptRunner from '@/commands/script-runner';
import { exist, findRootUri, toNormalizePath } from '@/common/utils';

export default async function packageScript(uri?: vscode.Uri) {
  const { workspaceFolders, fs } = vscode.workspace;

  uri ??= (workspaceFolders?.length === 1 ? workspaceFolders[0] : await vscode.window.showWorkspaceFolderPick())?.uri;

  if (!uri) return;

  const { type } = await fs.stat(uri);

  if (type === vscode.FileType.Directory) uri = vscode.Uri.joinPath(uri, 'package.json');
  else if (Utils.basename(uri) !== 'package.json') {
    const rootUri = findRootUri(uri);

    if (!rootUri) return;

    uri = vscode.Uri.joinPath(rootUri, 'package.json');
  }

  if (!exist(uri)) return vscode.window.showWarningMessage('没有在工作区找到package.json');

  const { scripts } = JSON.parse(await fs.readFile(uri)) ?? {};
  const scriptKeys = Object.keys(scripts);

  if (!scripts || scriptKeys.length === 0) return vscode.window.showWarningMessage('没有找到命令');

  const quickPickItem: Array<vscode.QuickPickItem> = scriptKeys.map(label => ({ detail: scripts[label], label }));
  const pickedItem = await vscode.window.showQuickPick(quickPickItem, { placeHolder: toNormalizePath(uri) });

  if (!pickedItem) return;

  const [targetUri, script] = [Utils.dirname(uri), `npm run ${pickedItem.label}`];

  scriptRunner(targetUri, [script], [Utils.basename(targetUri), script].join(' - '), true, false, true);
}
