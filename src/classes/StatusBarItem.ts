/**
 * @Author likan
 * @Date 2022/09/03 20:13:55
 * @Filepath likan/src/classes/StatusBarItem.ts
 */

import { CONFIG } from '@/common/constants';

export default class StatusBarItem<T extends Array<unknown>> extends vscode.Disposable {
  #statusBarItem: vscode.StatusBarItem;

  #icon: string;

  text = '';

  #onConfigChangeStack: Array<(config: boolean) => void> = [];

  visible = false;

  command?: vscode.StatusBarItem['command'];

  changeConfiguration?: vscode.Disposable;

  static Left = vscode.StatusBarAlignment.Left;

  static Right = vscode.StatusBarAlignment.Right;

  constructor (
    key?: keyof typeof CONFIG,
    alignment?: vscode.StatusBarAlignment,
    priority?: number,
    icon = '',
    text = '',
    visible = true,
  ) {
    super(() => {
      this.#statusBarItem.dispose();
    });

    this.#statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
    this.#icon = icon;

    this.setText(text).setVisible(visible);

    if (key)
      this.changeConfiguration = vscode.workspace.onDidChangeConfiguration(({ affectsConfiguration }) => {
        if (this.#onConfigChangeStack.length > 0 && affectsConfiguration(CONFIG[key]))
          for (const task of this.#onConfigChangeStack) task(<boolean>Configuration[key]);
      });
  }

  set onConfigChanged (callback: (bool: boolean) => void) {
    this.#onConfigChangeStack.push(callback);
  }

  resetState () {
    this.setVisible(false);
    this.setText('');
    this.setTooltip('');
    this.setCommand();

    return this;
  }

  update(...parameter: T extends Array<unknown> ? T : void): void;

  update () {
    //
  }

  setVisible (visible: boolean) {
    if (visible) this.#statusBarItem.show();
    else this.#statusBarItem.hide();

    this.visible = visible;

    return this;
  }

  setText (text: string) {
    this.#statusBarItem.text = `${this.#icon} ${text}`;

    this.text = text;

    return this;
  }

  setTooltip (tooltip: vscode.StatusBarItem['tooltip']) {
    this.#statusBarItem.tooltip = tooltip;

    return this;
  }

  setCommand (command?: vscode.StatusBarItem['command']) {
    this.#statusBarItem.command = command;

    this.command = command;

    return this;
  }
}
