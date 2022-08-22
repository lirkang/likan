/**
 * @Author likan
 * @Date 2022/8/21 19:32:37
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\open.window.ts
 */

export default function windowOpen({ fsPath }: vscode.Uri) {
  vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(fsPath), true).then(() => {
    //
  });
}
