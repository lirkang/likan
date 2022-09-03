/**
 * @Author likan
 * @Date 2022/09/03 20:13:55
 * @FilePath D:\CodeSpace\Dev\likan\src\classes\StatusBar.ts
 */

export default class StatusBar {
  statusBarItem: vscode.StatusBarItem;
  #icon = '';

  constructor(alignment?: vscode.StatusBarAlignment, priority?: number, icon = '') {
    this.statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
    this.#icon = icon;
  }

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
}
