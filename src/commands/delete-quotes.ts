/**
 * @Author Likan
 * @Date 2022/09/05 22:22:43
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\delete-quotes.ts
 */

export default function deleteQuotes() {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) return;

  const { selections, edit } = activeTextEditor;

  for (const { active } of selections) {
    edit;
  }
}
