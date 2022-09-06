/**
 * @Author Likan
 * @Date 2022/09/05 20:53:07
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\gitignore.ts
 */

import fetch from 'node-fetch';

type TemplateResponse = { name: string; source: string };

export default async function gitignore() {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders) return;

  const templateBaseUrl = 'https://api.github.com/gitignore/templates';
  const templateList = (await fetch(templateBaseUrl).then(response => response.json())) as Array<string>;
  const template = await vscode.window.showQuickPick(templateList);

  if (!template) return;

  let { source } = (await fetch(`${templateBaseUrl}/${template}`).then(response =>
    response.json()
  )) as TemplateResponse;

  const workspace =
    workspaceFolders.length > 1
      ? await vscode.window.showQuickPick(workspaceFolders.map(({ uri }) => uri.fsPath))
      : workspaceFolders[0].uri.fsPath;

  if (!workspace) return;

  const targetPath = path.join(workspace, '.gitignore');

  if (fs.existsSync(targetPath)) {
    const mode = await vscode.window.showQuickPick(['append', 'rewrite']);

    if (!mode) return;

    if (mode === 'append') {
      source = `${fs.readFileSync(targetPath, 'utf8')}\n${source}`;
    }
  }

  fs.writeFileSync(targetPath, source);
}
