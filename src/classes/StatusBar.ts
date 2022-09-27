/**
 * @Author likan
 * @Date 2022/09/03 20:13:55
 * @Filepath likan/src/classes/StatusBar.ts
 */

export default class StatusBar extends vscode.Disposable {
  #statusBarItem: vscode.StatusBarItem;
  #icon: string;
  text = '';
  visible = false;

  constructor(alignment?: vscode.StatusBarAlignment, priority?: number, icon = '', text = '', visible = true) {
    const statusBarItem = vscode.window.createStatusBarItem(alignment, priority);

    super(statusBarItem.dispose);

    this.#statusBarItem = statusBarItem;
    this.#icon = icon;

    this.setText(text).setVisible(visible);
  }

  resetState() {
    this.setVisible(false);
    this.setText('');
    this.setTooltip('');
    this.setCommand();

    return this;
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
