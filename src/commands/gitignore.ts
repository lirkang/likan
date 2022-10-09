/**
 * @Author likan
 * @Date 2022/09/05 20:53:07
 * @Filepath likan/src/commands/gitignore.ts
 */

import { concat, fromString } from 'uint8arrays';

import Loading from '@/classes/Loading';
import { TEMPLATE_BASE_URL } from '@/common/constants';
import request, { toNormalizePath } from '@/common/utils';

export default async function gitignore() {
  const { workspaceFolders, fs } = vscode.workspace;

  if (!workspaceFolders || workspaceFolders.length === 0) return;

  const workspace =
    workspaceFolders.length > 1
      ? await vscode.window.showWorkspaceFolderPick({ placeHolder: '选择目录' })
      : workspaceFolders[0];

  if (!workspace) return;

  Loading.createLoading('正在请求数据');

  const headers = { 'User-Agent': 'likan' };
  const templateList = await request<Array<string>>({ headers, url: TEMPLATE_BASE_URL });
  const quickPicker = vscode.window.createQuickPick();

  quickPicker.items = templateList.map(label => ({
    buttons: [{ iconPath: new vscode.ThemeIcon('globe'), tooltip: `${TEMPLATE_BASE_URL}/${label}` }],
    label,
  }));

  quickPicker.onDidChangeActive(([{ label }]) => {
    quickPicker.placeholder = `${TEMPLATE_BASE_URL}/${label}`;
  });

  quickPicker.onDidTriggerItemButton(async ({ item: { label } }) => {
    quickPicker.dispose();

    await vscode.env.openExternal(vscode.Uri.parse(`${TEMPLATE_BASE_URL}/${label}`));
  });

  quickPicker.onDidChangeSelection(async ([{ label }]) => {
    quickPicker.dispose();

    const { source } = await request<Record<'name' | 'source', string>>({
      headers,
      url: `${TEMPLATE_BASE_URL}/${label}`,
    });
    const remoteSource = fromString(source);
    const targetUri = vscode.Uri.joinPath(workspace.uri, '.gitignore');

    Loading.dispose();

    try {
      const localSource = await fs.readFile(targetUri);

      if (localSource.length === 0) throw remoteSource;

      const mode = await vscode.window.showQuickPick(['添加', '覆盖'], { placeHolder: toNormalizePath(targetUri) });

      if (!mode) return;

      throw mode === '添加' ? concat([localSource, fromString('\n'), remoteSource]) : remoteSource;
    } catch (error: unknown) {
      await fs.writeFile(targetUri, error instanceof Uint8Array ? error : remoteSource);
    }
  });

  quickPicker.show();
}
