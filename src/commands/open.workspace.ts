/**
 * @Author likan
 * @Date 2022/8/23 21:07:06
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\open.workspace.ts
 */

import { getConfig, thenableToPromise } from '@/utils';

export default async function openWorkspace() {
  const folders = getConfig('folders');
  const dirs = folders.map(f =>
    fs.existsSync(f) ? fs.readdirSync(f).map(d => ({ label: `$(folder) ${d}`, description: path.join(f, d) })) : void 0
  );

  // @ts-ignore
  const flatDirs: Array<vscode.QuickPickItem> = dirs
    .filter(d => d)
    .flat(Infinity)
    // @ts-ignore
    .filter(({ description }) => fs.statSync(description).isDirectory());

  thenableToPromise(vscode.window.showQuickPick(flatDirs, { placeHolder: '打开项目' }), 'description').then(
    description => {
      vscode.commands.executeCommand('likan.open.window', vscode.Uri.file(description!));
    }
  );
}
