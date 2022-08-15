/**
 * @Author likan
 * @Date 2022/8/15 16:05:41
 * @FilePath E:\WorkSpace\likan\src\commands\terminal.ts
 */

import { window } from 'vscode';

import { thenableToPromise } from '@/utils';

let id: number | undefined;
let is_opened = false;

if (window.terminals.length) {
  const terminal = window.terminals.at(-1);

  if (terminal) {
    terminal.hide();
    is_opened = false;
    thenableToPromise(terminal.processId).then(r => (id = r));
  }
}

window.onDidChangeActiveTerminal(e => {
  if (e) {
    thenableToPromise(e.processId).then(r => (id = r));
  }

  is_opened = Boolean(e);
});

export default async function terminal() {
  if (!window.terminals.length) {
    window.createTerminal().show();
  } else {
    for await (const { processId, show, hide } of window.terminals) {
      if ((await processId) === id) {
        is_opened ? hide() : show();
        is_opened = !is_opened;

        break;
      }
    }
  }
}
