/**
 * @Author likan
 * @Date 2022/8/15 16:05:41
 * @FilePath E:\WorkSpace\likan\src\commands\terminal.ts
 */

import { thenableToPromise } from '@/utils';

let id: number | undefined;
let is_opened = false;

if (vscode.window.terminals.length) {
  const terminal = vscode.window.terminals.at(-1);

  if (terminal) {
    terminal.hide();
    is_opened = false;
    thenableToPromise(terminal.processId).then(r => (id = r));
  }
}

vscode.window.onDidChangeActiveTerminal(e => {
  if (e) {
    thenableToPromise(e.processId).then(r => (id = r));
  }

  is_opened = Boolean(e);
});

export default async function terminal() {
  if (!vscode.window.terminals.length) {
    vscode.window.createTerminal().show();
  } else {
    for await (const { processId, show, hide } of vscode.window.terminals) {
      if ((await processId) === id) {
        is_opened ? hide() : show();
        is_opened = !is_opened;

        break;
      }
    }
  }
}
