/**
 * @Author likan
 * @Date 2022/09/05 20:53:07
 * @Filepath likan/src/commands/gitignore.ts
 */

import Loading from '@/classes/Loading';
import { toNormalizePath } from '@/common/utils';

const TEMPLATE_BASE_URL = 'https://api.github.com/gitignore/templates';
const headers = { 'User-Agent': 'likan' };

export default async function gitignore () {
  const { workspaceFolders, fs } = vscode.workspace;

  if (!workspaceFolders || workspaceFolders.length === 0) return;

  const workspace =
    workspaceFolders.length > 1
      ? await vscode.window.showWorkspaceFolderPick({ placeHolder: '选择目录' })
      : workspaceFolders[0];

  if (!workspace) return;

  Loading.createLoading('正在请求数据');

  const templateList = (await fetch(TEMPLATE_BASE_URL, { headers }).then(response => response.json())) as Array<string>;
  const quickPicker = vscode.window.createQuickPick();

  quickPicker.items = templateList.map(label => ({
    buttons: [ { iconPath: new vscode.ThemeIcon('globe'), tooltip: `${TEMPLATE_BASE_URL}/${label}` } ],
    label,
  }));

  quickPicker.onDidChangeActive(([ { label } ]) => {
    quickPicker.placeholder = `${TEMPLATE_BASE_URL}/${label}`;
  });

  quickPicker.onDidTriggerItemButton(async ({ item: { label } }) => {
    quickPicker.dispose();

    await vscode.env.openExternal(vscode.Uri.parse(`${TEMPLATE_BASE_URL}/${label}`));
  });

  quickPicker.onDidChangeSelection(async ([ { label } ]) => {
    quickPicker.dispose();

    const { source } = (await fetch(`${TEMPLATE_BASE_URL}/${label}`, { headers }).then(response => response.json())) as Record<'name' | 'source', string>;
    const remoteSource = Buffer.from(source);
    const targetUri = vscode.Uri.joinPath(workspace.uri, '.gitignore');

    Loading.dispose();

    try {
      const localSource = await fs.readFile(targetUri);

      if (localSource.length === 0) throw remoteSource;

      const mode = await vscode.window.showQuickPick([ '添加', '覆盖' ], { placeHolder: toNormalizePath(targetUri) });

      if (!mode) return;

      throw mode === '添加' ? Buffer.concat([ localSource, Buffer.from('\n'), remoteSource ]) : remoteSource;
    } catch (error: unknown) {
      await fs.writeFile(targetUri, <Buffer>error);
    }
  });

  quickPicker.show();
}
