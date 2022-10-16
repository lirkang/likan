/**
 * @Author likan
 * @Date 2022/09/07 22:45:10
 * @Filepath likan/src/commands/package-script.ts
 */

import { Utils } from 'vscode-uri';

import { exists, getKeys, toNormalizePath } from '@/common/utils';

export default async function packageScript (uri?: vscode.Uri) {
  const { workspaceFolders, fs } = vscode.workspace;

  uri ??= (workspaceFolders?.length === 1 ? workspaceFolders[0] : await vscode.window.showWorkspaceFolderPick())?.uri;

  if (!uri) return;

  const { type } = await fs.stat(uri);

  if (type === vscode.FileType.Directory) uri = vscode.Uri.joinPath(uri, 'package.json');
  else if (Utils.basename(uri) !== 'package.json') return;

  if (!exists(uri)) return vscode.window.showWarningMessage('没有找到package.json');

  const packageJson = await fs.readFile(uri);
  const { scripts } = JSON.parse(packageJson) ?? {};
  const scriptLabels = getKeys<string>(scripts);

  if (!scripts || scriptLabels.length === 0) return vscode.window.showWarningMessage('没有找到命令');

  const quickPickItem: Array<vscode.QuickPickItem> = scriptLabels.map(label => ({ detail: scripts[label], label }));

  quickPickItem.unshift({
    kind: vscode.QuickPickItemKind.Separator,
    label: toNormalizePath(uri),
  });

  const pickedItem = await vscode.window.showQuickPick(quickPickItem, { placeHolder: toNormalizePath(uri) });

  if (!pickedItem) return;

  const [ targetUri, script ] = [ Utils.dirname(uri), `npm run ${pickedItem.label}` ];

  vscode.commands.executeCommand(
    'likan.other.scriptRunner',
    targetUri,
    [ script ],
    [ Utils.basename(targetUri), script ].join(' - '),
    true,
    false,
    true,
  );
}
