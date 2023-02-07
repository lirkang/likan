/**
 * @Author likan
 * @Date 2022/09/03 20:13:55
 * @Filepath likan/src/classes/StatusBarItem.ts
 */

export default class StatusBarItem<T extends Array<unknown>> implements vscode.Disposable {
  private _statusBarItem: vscode.StatusBarItem;

  public command?: vscode.StatusBarItem['command'];

  public static Left = vscode.StatusBarAlignment.Left;
  public static Right = vscode.StatusBarAlignment.Right;

  constructor(
    alignment?: vscode.StatusBarAlignment,
    priority?: number,
    private _icon = '',
    public text = '',
    public visible = true
  ) {
    this._statusBarItem = vscode.window.createStatusBarItem(alignment, priority);

    this.setText(text).setVisible(visible);
  }

  public dispose() {
    this._statusBarItem.dispose();
  }

  public resetState() {
    this.setVisible(false);
    this.setText('');
    this.setTooltip('');
    this.setCommand();

    return this;
  }

  update(...parameter: T extends Array<unknown> ? T : void): void;

  public update() {
    //
  }

  public setVisible(visible: boolean) {
    if (visible) this._statusBarItem.show();
    else this._statusBarItem.hide();

    this.visible = visible;

    return this;
  }

  public setText(text: string) {
    this._statusBarItem.text = `${this._icon ? `${this._icon} ` : ''}${text}`;

    this.text = text;

    return this;
  }

  public setTooltip(tooltip: vscode.StatusBarItem['tooltip']) {
    this._statusBarItem.tooltip = tooltip;

    return this;
  }

  public setCommand(command?: vscode.StatusBarItem['command']) {
    this._statusBarItem.command = command;

    this.command = command;

    return this;
  }
}
