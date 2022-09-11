/**
 * @Author likan
 * @Date 2022/09/03 09:08:08
 * @FilePath D:\CodeSpace\Dev\likan\src\class\ExplorerTreeViewProvider.ts
 */

import { Utils } from 'vscode-uri';

import { getConfig, verifyExistAndNotFile } from '@/common/utils';

class ExplorerTreeViewProvider implements vscode.TreeDataProvider<vscode.Uri> {
  private _onDidChangeTreeData = new vscode.EventEmitter<vscode.Uri | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh = () => {
    this._onDidChangeTreeData.fire();
  };

  async getTreeItem(uri: vscode.Uri) {
    const { type } = await vscode.workspace.fs.stat(uri);
    const treeItem = new vscode.TreeItem(uri, type - 1);

    treeItem.tooltip = uri.fsPath;
    treeItem.label = Utils.basename(uri);

    if (type === vscode.FileType.File) {
      treeItem.command = { arguments: [uri], command: 'vscode.open', title: '打开文件' };
    }

    return treeItem;
  }

  async getChildren(uri?: vscode.Uri) {
    const { folders, filterFolders } = getConfig();

    if (uri) {
      const files: [Array<vscode.Uri>, Array<vscode.Uri>] = [[], []];
      const directories = await vscode.workspace.fs.readDirectory(uri);
      const filleterRegExp = new RegExp(filterFolders.join('|').replaceAll('.', '\\.'));

      for (const [dirname, fileType] of directories) {
        if (filleterRegExp.test(dirname) || fileType === vscode.FileType.Unknown) continue;

        files[Number(fileType === vscode.FileType.File)].push(vscode.Uri.joinPath(uri, dirname));
      }

      return files.flatMap(array => array.sort());
    }

    return folders.filter(element => verifyExistAndNotFile(element)).map(element => vscode.Uri.file(element));
  }
}

const explorerTreeViewProvider = new ExplorerTreeViewProvider();

export default explorerTreeViewProvider;
