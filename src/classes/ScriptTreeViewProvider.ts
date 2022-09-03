/**
 * @Author likan
 * @Date 2022/09/03 09:07:57
 * @FilePath D:\CodeSpace\Dev\likan\src\class\ScriptTreeViewProvider.ts
 */

import { PACKAGE_JSON, TRUE } from '@/common/constants';
import { getConfig, getKeys, toFirstUpper } from '@/common/utils';

export class ScriptTreeViewProvider implements vscode.TreeDataProvider<ScriptsTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ScriptsTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem({ fsPath, first, label, script }: ScriptsTreeItem) {
    const { Collapsed, None, Expanded } = vscode.TreeItemCollapsibleState;

    const treeItem = new vscode.TreeItem(
      vscode.Uri.parse(path.basename(fsPath)),
      first ? Expanded : fs.statSync(fsPath).isDirectory() ? Collapsed : None
    );

    treeItem.label = label ?? path.basename(fsPath);
    treeItem.tooltip = toFirstUpper(fsPath);

    if (script) {
      treeItem.command = { arguments: [fsPath, label], command: 'likan.other.scriptsRunner', title: '执行命令' };
    }

    return treeItem;
  }
  getChildren(element?: ScriptsTreeItem) {
    const { filterFolders } = getConfig();

    if (!element) {
      const { workspaceFolders } = vscode.workspace;

      if (!workspaceFolders?.length) return [];

      return workspaceFolders.map(({ uri: { fsPath } }) => ({ first: TRUE, fsPath }));
    } else {
      const { fsPath } = element;

      const filepath = path.join(fsPath, PACKAGE_JSON);

      if (fs.existsSync(filepath)) {
        const { scripts } = JSON.parse(fs.readFileSync(filepath, 'utf8')) ?? {};

        return getKeys(scripts)
          .sort()
          .map(k => ({ fsPath: filepath, label: k, script: scripts[k] }));
      } else {
        return fs
          .readdirSync(fsPath)
          .filter(d => fs.statSync(path.join(fsPath, d)).isDirectory())
          .map(d => ({ fsPath: path.join(fsPath, d) }))
          .filter(({ fsPath }) => !filterFolders.some(f => new RegExp(f.replaceAll('.', '\\.')).test(fsPath)));
      }
    }
  }
}

const scriptTreeViewProvider = new ScriptTreeViewProvider();

export default scriptTreeViewProvider;
