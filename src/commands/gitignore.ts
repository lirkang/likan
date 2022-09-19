/**
 * @Author likan
 * @Date 2022/09/05 20:53:07
 * @Filepath E:/TestSpace/extension/likan/src/commands/gitignore.ts
 */

import { concat, fromString, toString } from 'uint8arrays';

import Loading from '@/classes/Loading';
import { TEMPLATE_BASE_URL, VOID } from '@/common/constants';
import request, { toNormalizePath } from '@/common/utils';

type TemplateResponse = { name: string; source: string };

export default async function gitignore() {
  Loading.createLoading('正在发起网络请求');

  const { workspaceFolders, fs } = vscode.workspace;

  const templateList = await request<Array<string>>({ headers: { 'User-Agent': 'likan' }, url: TEMPLATE_BASE_URL });
  const template = await vscode.window.showQuickPick(templateList);

  if (!workspaceFolders || workspaceFolders.length === 0 || !template) return Loading.disposeLastOne();

  const { source } = await request<TemplateResponse>({
    headers: { 'User-Agent': 'likan' },
    url: `${TEMPLATE_BASE_URL}/${template}`,
  });

  const Uint8ArraySource = fromString(source);
  const workspace =
    workspaceFolders.length > 1
      ? await vscode.window.showWorkspaceFolderPick({ placeHolder: '选择目录' })
      : workspaceFolders[0];

  if (!workspace) return Loading.disposeLastOne();

  const targetUri = vscode.Uri.joinPath(workspace.uri, '.gitignore');

  try {
    const originSource = await fs.readFile(targetUri);

    if (/(^\s+$)|(^$)/.test(toString(originSource))) throw VOID;

    const mode = await vscode.window.showQuickPick(['添加', '覆盖'], {
      placeHolder: toNormalizePath(targetUri),
    });

    if (!mode) return Loading.disposeLastOne();

    if (mode === '添加') {
      fs.writeFile(targetUri, concat([originSource, fromString('\n'), Uint8ArraySource]));
      Loading.disposeLastOne();
    } else {
      throw VOID;
    }
  } catch {
    fs.writeFile(targetUri, Uint8ArraySource);
    Loading.disposeLastOne();
  }
}
