/**
 * @Author likan
 * @Date 2022/8/23 21:07:06
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\open.workspace.ts
 */

import { FALSE } from '@/constants';
import { getConfig, openFolder } from '@/utils';

export default async function openWorkspace(folders: Array<string> | string = getConfig('folders'), isMany = true) {
  const flatDirs: Array<vscode.QuickPickItem> = [];
  const buttons = [
    { tooltip: '在当前窗口打开', iconPath: new vscode.ThemeIcon('replace-all'), index: 0 },
    { tooltip: '上一级', iconPath: new vscode.ThemeIcon('arrow-up'), index: 1 },
    { tooltip: '下一级', iconPath: new vscode.ThemeIcon('arrow-down'), index: 2 },
  ];

  if (isMany && Array.isArray(folders)) {
    folders = folders.filter(fs.existsSync);

    const dirs = folders.map(
      f =>
        fs.readdirSync(f).map(d => ({
          label: `$(folder) ${d}`,
          description: path.join(f, d),
          buttons,
        })) as Array<vscode.QuickPickItem>
    );

    for (const f in dirs) {
      flatDirs.push(
        { label: `$(tag) ${folders[f]}`, detail: folders[f] },
        ...dirs[f].filter(({ description }) => fs.existsSync(description!))
      );
    }
  } else {
    const dirs = fs.readdirSync(<string>folders).filter(f => fs.statSync(path.join(<string>folders, f)).isDirectory());

    flatDirs.push(
      ...dirs.map(d => ({
        label: `$(folder) ${d}`,
        description: path.join(<string>folders, d),
        buttons,
      }))
    );
  }

  const quickPick = vscode.window.createQuickPick();

  quickPick.placeholder = '打开项目';
  quickPick.items = flatDirs;

  // @ts-ignore
  quickPick.onDidTriggerItemButton(({ item: { description, detail }, button: { index } }) => {
    switch (index) {
      case 0:
        return openFolder((description ?? detail)!, FALSE);

      case 1:
        return openWorkspace(path.join((description ?? detail)!, '../..'), false);

      case 2:
        return openWorkspace((description ?? detail)!, false);
    }
  });
  quickPick.onDidChangeSelection(([{ description, detail }]) => openFolder((description ?? detail)!));

  quickPick.show();
}
