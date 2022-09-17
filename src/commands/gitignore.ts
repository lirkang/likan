/**
 * @Author Likan
 * @Date 2022/09/05 20:53:07
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\gitignore.ts
 */

import normalizePath from 'normalize-path';
import { concat, fromString, toString } from 'uint8arrays';

import { TEMPLATE_BASE_URL, VOID } from '@/common/constants';
import request, { firstToUppercase, withLoading } from '@/common/utils';

type TemplateResponse = { name: string; source: string };

export default async function gitignore() {
  const awaitTemplateListTask = request({ headers: { 'User-Agent': 'likan' }, url: TEMPLATE_BASE_URL });
  const templateList = await withLoading(awaitTemplateListTask as Promise<Array<string>>, '正在发起网络请求');
  const template = await vscode.window.showQuickPick(templateList);
  const { workspaceFolders, fs } = vscode.workspace;

  if (!workspaceFolders || workspaceFolders.length === 0 || !template) return;

  const awaitSourceTask = request({ headers: { 'User-Agent': 'likan' }, url: `${TEMPLATE_BASE_URL}/${template}` });
  const { source } = await withLoading(awaitSourceTask as Promise<TemplateResponse>, '正在发起网络请求');

  const Uint8ArraySource = fromString(source);
  const workspace =
    workspaceFolders.length > 1
      ? await vscode.window.showWorkspaceFolderPick({ placeHolder: '选择目录' })
      : workspaceFolders[0];

  if (!workspace) return;

  const targetUri = vscode.Uri.joinPath(workspace.uri, '.gitignore');

  try {
    const originSource = await fs.readFile(targetUri);

    if (/(^\s+$)|(^$)/.test(toString(originSource))) throw VOID;

    const mode = await vscode.window.showQuickPick(['append', 'rewrite'], {
      placeHolder: firstToUppercase(normalizePath(targetUri.fsPath)),
    });

    if (!mode) return;

    if (mode === 'append') {
      fs.writeFile(targetUri, concat([originSource, fromString('\n'), Uint8ArraySource]));
    } else {
      throw VOID;
    }
  } catch {
    fs.writeFile(targetUri, Uint8ArraySource);
  }
}
