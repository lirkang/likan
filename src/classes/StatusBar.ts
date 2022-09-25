/**
 * @Author likan
 * @Date 2022/09/03 20:13:55
 * @Filepath src/classes/StatusBar.ts
 */

import { EMPTY_STRING } from '@/common/constants';

export default class StatusBar {
  #statusBarItem: vscode.StatusBarItem;
  #icon: string;
  text = '';
  visible = false;

  constructor(
    alignment?: vscode.StatusBarAlignment,
    priority?: number,
    icon = EMPTY_STRING,
    text = '',
    visible = true
  ) {
    this.#statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
    this.#icon = icon;
    this.setText(text);
    this.setVisible(visible);
  }

  dispose: vscode.Disposable['dispose'] = () => {
    this.#statusBarItem.dispose();
  };

  resetState() {
    this.setVisible(false);
    this.setText('');
    this.setTooltip('');
    this.setCommand();
  }

  setVisible(visible: boolean) {
    if (visible) {
      this.#statusBarItem.show();
    } else {
      this.#statusBarItem.hide();
    }

    this.visible = visible;

    return this;
  }

  setText(text: string) {
    this.#statusBarItem.text = `${this.#icon} ${text}`;

    this.text = text;

    return this;
  }

  setTooltip(tooltip: vscode.StatusBarItem['tooltip']) {
    this.#statusBarItem.tooltip = tooltip;

    return this;
  }

  setCommand(command?: vscode.StatusBarItem['command']) {
    this.#statusBarItem.command = command;

    return this;
  }
}
