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
    await vscode.env.openExternal(vscode.Uri.parse(`${TEMPLATE_BASE_URL}/${label}`));
    quickPicker.dispose();
  });

  quickPicker.onDidChangeSelection(async ([{ label }]) => {
    quickPicker.hide();

    const { source } = await request<Record<'name' | 'source', string>>({
      headers,
      url: `${TEMPLATE_BASE_URL}/${label}`,
    });
    const remoteSource = fromString(source);
    const targetUri = vscode.Uri.joinPath(workspace.uri, '.gitignore');

    try {
      const originSource = await fs.readFile(targetUri);

      if (originSource.byteLength === 0) throw undefined;

      const quickPicker = vscode.window.createQuickPick();

      quickPicker.items = ['添加', '覆盖'].map(label => ({ label }));
      quickPicker.buttons = [
        { iconPath: new vscode.ThemeIcon('go-to-file'), tooltip: '打开目标文件' },
        { iconPath: new vscode.ThemeIcon('globe'), tooltip: '打开源链接' },
      ];
      quickPicker.ignoreFocusOut = true;
      quickPicker.placeholder = toNormalizePath(targetUri);
      quickPicker.title = '选择模式(按ESC退出)';

      quickPicker.onDidTriggerButton(({ tooltip }) => {
        if (tooltip === '打开目标文件') vscode.commands.executeCommand('likan.open.currentWindow', targetUri);
        else vscode.env.openExternal(vscode.Uri.parse(`${TEMPLATE_BASE_URL}/${label}`));
      });

      quickPicker.onDidChangeSelection(async ([{ label }]) => {
        await fs.writeFile(
          targetUri,
          label === '添加' ? concat([originSource, fromString('\n'), remoteSource]) : remoteSource
        );

        quickPicker.dispose();
      });

      quickPicker.show();
    } catch {
      await fs.writeFile(targetUri, remoteSource);
    } finally {
      quickPicker.dispose();
      Loading.dispose();
    }
  });

  quickPicker.show();
}
