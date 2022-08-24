/**
 * @Author likan
 * @Date 2022/8/23 21:07:06
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\open.workspace.ts
 */

import { getConfig, thenableToPromise } from '@/utils';

export default async function openWorkspace() {
  const folders = getConfig('folders').filter(fs.existsSync);
  const dirs = folders.map(
    f =>
      fs.readdirSync(f).map(d => ({
        label: `$(folder) ${d}`,
        description: path.join(f, d),
        // buttons: [{ tooltip: 'asdasdasd', iconPath: { id: 'alert', color: 'red' } }],
      })) as Array<vscode.QuickPickItem>
  );

  const flatDirs: Array<vscode.QuickPickItem> = [];

  for (const f in dirs) {
    flatDirs.push(
      { kind: vscode.QuickPickItemKind.Separator, label: folders[f] },
      ...dirs[f].filter(({ description }) => fs.existsSync(description!))
    );
  }

  thenableToPromise(vscode.window.showQuickPick(flatDirs, { placeHolder: '打开项目' }), 'description').then(
    description => {
      vscode.commands.executeCommand('likan.open.window', vscode.Uri.file(description!));
    }
  );
}
