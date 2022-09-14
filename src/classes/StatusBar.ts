/**
 * @Author likan
 * @Date 2022/09/03 20:13:55
 * @FilePath D:\CodeSpace\Dev\likan\src\classes\StatusBar.ts
 */

import { EMPTY_STRING } from '@/common/constants';

export default class StatusBar {
  statusBarItem: vscode.StatusBarItem;
  #icon: string;

  constructor(alignment?: vscode.StatusBarAlignment, priority?: number, icon = EMPTY_STRING) {
    this.statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
    this.#icon = icon;
  }

  dispose: vscode.Disposable['dispose'] = () => {
    this.statusBarItem.dispose();
  };

  setVisible(visible: boolean) {
    if (visible) {
      this.statusBarItem.show();
    } else {
      this.statusBarItem.hide();
    }
  }

  setText(text: string) {
    this.statusBarItem.text = `${this.#icon} ${text}`;
  }

  setTooltip(tooltip: string) {
    this.statusBarItem.tooltip = tooltip;
  }

  setCommand(command: vscode.Command) {
    this.statusBarItem.command = command;
  }
}
