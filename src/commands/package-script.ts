/**
 * @Author Likan
 * @Date 2022/09/07 22:45:10
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\package-script.ts
 */

import { NPM_MANAGER_MAP, PACKAGE_JSON } from '@/common/constants';
import { getConfig, getKeys, toFirstUpper } from '@/common/utils';

export default async function packageScript(uri: vscode.Uri) {
  const { type } = await vscode.workspace.fs.stat(uri);

  if (type === vscode.FileType.Directory) {
    uri = vscode.Uri.joinPath(uri, PACKAGE_JSON);
  } else {
    if (!uri.fsPath.endsWith(PACKAGE_JSON)) return;
  }

  if (!fs.existsSync(uri.fsPath)) {
    return vscode.window.showWarningMessage(`没有找到${PACKAGE_JSON}`);
  }

  // @ts-ignore
  const { scripts } = JSON.parse(fs.readFileSync(uri.fsPath) ?? {});

  const scriptLabels = getKeys<string>(scripts ?? {}).sort();

  if (!scripts || scriptLabels.length === 0) {
    return vscode.window.showWarningMessage('没有可用的脚本');
  }

  const quickPickItem: Array<vscode.QuickPickItem> = scriptLabels.map(label => ({ detail: scripts[label], label }));

  quickPickItem.unshift({ kind: vscode.QuickPickItemKind.Separator, label: toFirstUpper(uri.fsPath) });

  const pickedItem = await vscode.window.showQuickPick(quickPickItem);

  if (!pickedItem) return;

  const [targetPath, script] = [
    path.dirname(uri.fsPath),
    `${NPM_MANAGER_MAP[getConfig('manager')]} ${pickedItem.label}`,
  ];

  vscode.commands.executeCommand('likan.other.scriptRunner', [`cd ${targetPath}`, script], `${targetPath}-${script}`);
}
