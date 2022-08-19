/**
 * @Author likan
 * @Date 2022/8/15 16:05:41
 * @FilePath E:\WorkSpace\likan\src\commands\terminal.ts
 */

export default async function terminal() {
  vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal').then(() => {
    //
  });
}
