/**
 * @Author Likan
 * @Date 2022/09/05 22:18:54
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\open-browser.ts
 */

export default async function openDefaultBrowser(uri = vscode.window.activeTextEditor?.document.uri) {
  if (!uri) return;

  vscode.env.openExternal(uri);
}
