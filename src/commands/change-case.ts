/**
 * @Author Likan
 * @Date 2022/09/05 22:23:42
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\change-case.ts
 */

export default function changeCase() {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) return;

  const { selections, edit } = activeTextEditor;

  for (const { active } of selections) {
    edit;
  }
}
