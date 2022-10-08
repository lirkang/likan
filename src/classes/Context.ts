/**
 * @Author likan
 * @Date 2022-10-08 13:06:48
 * @Filepath likan/src/classes/Context.ts
 * @Description
 */

export default class VscodeContext {
  static context: vscode.ExtensionContext;

  constructor() {
    //
  }

  static initContext(context: vscode.ExtensionContext) {
    this.context = context;
  }
}
