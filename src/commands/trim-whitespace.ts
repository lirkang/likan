/**
 * @Author likan
 * @Date 2022/09/03 13:52:09
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\trim-whitespace.ts
 */

async function deleteLeft() {
  await vscode.commands.executeCommand('deleteLeft');
}

export default async function trimWhitespace() {
  let flag = true;

  for (;;) {
    if (!vscode.window.activeTextEditor) break;

    const { document, selection } = vscode.window.activeTextEditor;
    let { character, line } = selection.active;

    if (--character < 0) {
      character = document.lineAt(--line).range.end.character;
    }

    const leftText = document.getText(new vscode.Range(new vscode.Position(line, character), selection.active));

    if (/\s/.test(leftText)) {
      flag = false;
      await deleteLeft();
    } else {
      if (flag) await deleteLeft();
      break;
    }
  }
}
