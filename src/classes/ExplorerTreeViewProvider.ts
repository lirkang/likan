/**
 * @Author likan
 * @Date 2022/09/03 09:08:08
 * @Filepath likan/src/classes/ExplorerTreeViewProvider.ts
 */

import { unary } from 'lodash-es';
import { Utils } from 'vscode-uri';

import { exist, getConfig, toNormalizePath } from '@/common/utils';

class ExplorerTreeViewProvider implements vscode.TreeDataProvider<vscode.Uri> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<vscode.Uri | void>();
  private readonly baseFolder = getConfig('folders').map(unary(vscode.Uri.file)).filter(unary(exist));
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh = () => {
    this._onDidChangeTreeData.fire();
  };

  async getTreeItem(uri: vscode.Uri) {
    const basename = Utils.basename(uri);
    const { type } = await vscode.workspace.fs.stat(uri);
    const isBaseFolder = this.baseFolder.some(({ fsPath }) => fsPath === uri.fsPath);
    const { Collapsed, Expanded, None } = vscode.TreeItemCollapsibleState;
    const { File } = vscode.FileType;
    const treeItem = new vscode.TreeItem(uri, isBaseFolder ? Expanded : type === File ? None : Collapsed);

    treeItem.tooltip = toNormalizePath(uri);
    treeItem.label = basename;

    if (type === File) {
      treeItem.contextValue = `file-${basename}`;
      treeItem.command = { arguments: [uri], command: 'vscode.open', title: '打开文件' };
    } else {
      treeItem.contextValue = `directory-${basename}`;
    }

    return treeItem;
  }

  async getChildren(uri?: vscode.Uri) {
    const { filterFolders } = getConfig();

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

    return this.baseFolder;
  }
}

const explorerTreeViewProvider = new ExplorerTreeViewProvider();

export default explorerTreeViewProvider;
