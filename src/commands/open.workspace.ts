/**
 * @Author likan
 * @Date 2022/8/23 21:07:06
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\open.workspace.ts
 */

import { FALSE } from '@/constants';
import { getConfig, openFolder } from '@/utils';

export default async function openWorkspace() {
  const folders = getConfig('folders').filter(fs.existsSync);
  const dirs = folders.map(
    f =>
      fs.readdirSync(f).map(d => ({
        label: `$(folder) ${d}`,
        description: path.join(f, d),
        buttons: [
          { tooltip: '在当前窗口打开', iconPath: new vscode.ThemeIcon('replace-all'), index: 0 },
          { tooltip: '打开父文件夹', iconPath: new vscode.ThemeIcon('folder'), index: 1 },
        ],
      })) as Array<vscode.QuickPickItem>
  );

  const flatDirs: Array<vscode.QuickPickItem> = [];

  for (const f in dirs) {
    flatDirs.push(
      { kind: vscode.QuickPickItemKind.Separator, label: folders[f] },
      ...dirs[f].filter(({ description }) => fs.existsSync(description!))
    );
  }
  const quickPick = vscode.window.createQuickPick();

  quickPick.placeholder = '打开项目';
  quickPick.items = flatDirs;

  // @ts-ignore
  quickPick.onDidTriggerItemButton(({ item: { description }, button: { index } }) => {
    if (index === 0) {
      openFolder(description!, FALSE);
    } else {
      openFolder(path.dirname(description!));
    }
  });
  quickPick.onDidChangeSelection(([{ description }]) => {
    openFolder(description!);
  });

  quickPick.show();
}
