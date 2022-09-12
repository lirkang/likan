/**
 * @Author Likan
 * @Date 2022/09/07 22:45:10
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\package-script.ts
 */

import { Utils } from 'vscode-uri';

import { exist, getKeys, toFirstUpper } from '@/common/utils';

export default async function packageScript(uri: vscode.Uri) {
  const { type } = await vscode.workspace.fs.stat(uri);

  if (type === vscode.FileType.Directory) {
    uri = vscode.Uri.joinPath(uri, 'package.json');
  } else {
    if (!uri.fsPath.endsWith('package.json')) return;
  }

  if (!exist(uri)) {
    return vscode.window.showWarningMessage('没有找到package.json');
  }

  const packageJson = await vscode.workspace.fs.readFile(uri);
  // @ts-ignore
  const { scripts } = JSON.parse(packageJson) ?? {};
  const scriptLabels = getKeys<string>(scripts).sort();

  if (!scripts || scriptLabels.length === 0) {
    return vscode.window.showWarningMessage('没有可用的脚本');
  }

  const quickPickItem: Array<vscode.QuickPickItem> = scriptLabels.map(label => ({ detail: scripts[label], label }));

  quickPickItem.unshift({ kind: vscode.QuickPickItemKind.Separator, label: toFirstUpper(uri.fsPath) });

  const pickedItem = await vscode.window.showQuickPick(quickPickItem);

  if (!pickedItem) return;

  const [targetUri, script] = [Utils.dirname(uri), `npm run ${pickedItem.label}`];

  vscode.commands.executeCommand(
    'likan.other.scriptRunner',
    targetUri,
    [script],
    [Utils.basename(targetUri), script].join(' - ')
  );
}
