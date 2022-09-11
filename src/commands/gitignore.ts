/**
 * @Author Likan
 * @Date 2022/09/05 20:53:07
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\gitignore.ts
 */

import fetch from 'node-fetch';
import { concat, fromString } from 'uint8arrays';

import { UNDEFINED } from '@/common/constants';

type TemplateResponse = { name: string; source: string };

export default async function gitignore() {
  const templateBaseUrl = 'https://api.github.com/gitignore/templates';
  const templateList = (await fetch(templateBaseUrl).then(response => response.json())) as Array<string>;
  const template = await vscode.window.showQuickPick(templateList);

  if (!template) return;

  const { source } = (await fetch(`${templateBaseUrl}/${template}`).then(response =>
    response.json()
  )) as TemplateResponse;

  const workspace = await vscode.window.showWorkspaceFolderPick({ placeHolder: '选择目录' });

  if (!workspace) return;

  const targetUri = vscode.Uri.joinPath(workspace.uri, '.gitignore');

  try {
    const originSource = await vscode.workspace.fs.readFile(targetUri);
    const mode = await vscode.window.showQuickPick(['append', 'rewrite']);

    if (!mode) return;

    if (mode === 'append') {
      vscode.workspace.fs.writeFile(targetUri, concat([originSource, fromString('\n'), fromString(source)]));
    } else {
      throw UNDEFINED;
    }
  } catch {
    vscode.workspace.fs.writeFile(targetUri, fromString(source));
  }
}
