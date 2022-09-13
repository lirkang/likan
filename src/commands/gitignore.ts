/**
 * @Author Likan
 * @Date 2022/09/05 20:53:07
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\gitignore.ts
 */

import fetch from 'node-fetch';
import { concat, fromString } from 'uint8arrays';

import { TEMPLATE_BASE_URL, VOID } from '@/common/constants';
import { withProgress } from '@/common/utils';

type TemplateResponse = { name: string; source: string };

export default async function gitignore() {
  const awaitTemplateListTask = fetch(TEMPLATE_BASE_URL).then(response => response.json());
  const templateList = await withProgress(awaitTemplateListTask as Promise<Array<string>>, '正在发起网络请求');
  const template = await vscode.window.showQuickPick(templateList);
  const { workspaceFolders } = vscode.workspace;

  if (!workspaceFolders || workspaceFolders.length === 0 || !template) return;

  const awaitSourceTask = fetch(`${TEMPLATE_BASE_URL}/${template}`).then(response => response.json());
  const { source } = await withProgress(awaitSourceTask as Promise<TemplateResponse>, '正在发起网络请求');

  const Uint8ArraySource = fromString(source);
  const workspace =
    workspaceFolders.length > 1
      ? await vscode.window.showWorkspaceFolderPick({ placeHolder: '选择目录' })
      : workspaceFolders[0];

  if (!workspace) return;

  const targetUri = vscode.Uri.joinPath(workspace.uri, '.gitignore');

  try {
    const originSource = await vscode.workspace.fs.readFile(targetUri);
    const mode = await vscode.window.showQuickPick(['append', 'rewrite']);

    if (!mode) return;

    if (mode === 'append') {
      vscode.workspace.fs.writeFile(targetUri, concat([originSource, fromString('\n'), Uint8ArraySource]));
    } else {
      throw VOID;
    }
  } catch {
    vscode.workspace.fs.writeFile(targetUri, Uint8ArraySource);
  }
}
