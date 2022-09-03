/**
 * @Author likan
 * @Date 2022/09/03 09:08:08
 * @FilePath D:\CodeSpace\Dev\likan\src\class\ExplorerTreeViewProvider.ts
 */

import { TRUE } from '@/common/constants';
import { getConfig, toFirstUpper } from '@/common/utils';

class ExplorerTreeViewProvider implements vscode.TreeDataProvider<Common.TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<Common.TreeItem | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh = () => {
    this._onDidChangeTreeData.fire();
  };

  getTreeItem({ dirname, fsPath, type, first }: Common.TreeItem) {
    const { Collapsed, None, Expanded } = vscode.TreeItemCollapsibleState;

    const collapsedType = first ? Expanded : type === 'folder' ? Collapsed : None;
    const treeItem = new vscode.TreeItem(vscode.Uri.parse(dirname), collapsedType);

    treeItem.tooltip = toFirstUpper(fsPath);

    if (type === 'file') {
      treeItem.command = { arguments: [vscode.Uri.file(fsPath)], command: 'vscode.open', title: '打开文件' };
    }

    if (first) {
      treeItem.label = toFirstUpper(dirname);
    }

    return treeItem;
  }

  getChildren(element?: Common.TreeItem) {
    const { folders, filterFolders } = getConfig();

    let folder: Array<Common.TreeItem> = [];

    if (!element) {
      const children = folders.filter(element => fs.existsSync(element));

      folder = children.map(f => ({ dirname: f, first: TRUE, fsPath: f, type: 'folder' }));
    } else {
      const { fsPath } = element;

      folder = fs.readdirSync(fsPath).map(dirname => ({
        dirname,
        fsPath: path.join(fsPath, dirname),
        type: fs.statSync(path.join(fsPath, dirname)).isDirectory() ? 'folder' : 'file',
      }));
    }

    return folder
      .filter(({ fsPath }) => !filterFolders.some(f => new RegExp(f.replaceAll('.', '\\.')).test(fsPath)))
      .sort(({ fsPath: preF }, { fsPath: currentF }) => {
        const preFStat = fs.statSync(preF);
        const currentFStat = fs.statSync(currentF);

        return preFStat.isDirectory() && currentFStat.isFile() ? -1 : 1;
      });
  }
}

const explorerTreeViewProvider = new ExplorerTreeViewProvider();

export default explorerTreeViewProvider;
