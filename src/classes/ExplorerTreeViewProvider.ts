/**
 * @Author likan
 * @Date 2022/09/03 09:08:08
 * @Filepath likan/src/classes/ExplorerTreeViewProvider.ts
 */

import { isUndefined, unary } from 'lodash-es';
import { Utils } from 'vscode-uri';

import { exist, formatSize } from '@/common/utils';

class _ExplorerTreeViewProvider implements vscode.TreeDataProvider<vscode.Uri> {
  private _onDidChangeTreeData = new vscode.EventEmitter<vscode.Uri | void>();

  public get _baseFolder() {
    return Configuration.FOLDERS.map(unary(vscode.Uri.file)).filter(unary(exist));
  }

  public refresh = (condition = true) => {
    if (condition !== false) this._onDidChangeTreeData.fire();
  };

  public async getTreeItem(uri: vscode.Uri) {
    const isBaseFolder = (<Array<vscode.Uri>>this._baseFolder).some(({ fsPath }) => fsPath === uri.fsPath);
    const basename = Utils.basename(uri);
    const { type } = await vscode.workspace.fs.stat(uri);
    const { Collapsed, Expanded, None } = vscode.TreeItemCollapsibleState;
    const { Directory, File, SymbolicLink, Unknown } = vscode.FileType;
    const treeItem = new vscode.TreeItem(uri, Collapsed);
    const contextValueMap: Record<vscode.FileType, string> = {
      [Directory]: 'directory',
      [File]: 'file',
      [SymbolicLink]: 'unknown',
      [Unknown]: 'unknown',
    };

    if (isBaseFolder) treeItem.collapsibleState = Expanded;
    else if (type === File) {
      if (Configuration.DESCRIPTION) {
        const { size } = await vscode.workspace.fs.stat(uri);

        treeItem.description = formatSize(size, 3);
      }

      treeItem.command = { arguments: [uri], command: 'vscode.open', title: '打开文件' };
      treeItem.collapsibleState = None;
    }

    treeItem.contextValue = `${contextValueMap[type]}-${basename}`;

    return treeItem;
  }

  public async getChildren(uri?: vscode.Uri) {
    if (isUndefined(uri)) return this._baseFolder;

    const files: [Array<vscode.Uri>, Array<vscode.Uri>] = [[], []];
    const directories = await vscode.workspace.fs.readDirectory(uri);
    const filleterRegExp =
      Configuration.FILTER_FOLDERS.length > 0
        ? new RegExp(Configuration.FILTER_FOLDERS.join('|').replaceAll('.', '\\.'))
        : /^$/s;
    const { File, SymbolicLink, Unknown } = vscode.FileType;

    for (const [dirname, fileType] of directories) {
      if (filleterRegExp.test(dirname) || [Unknown, SymbolicLink].includes(fileType)) continue;

      files[Number(fileType === File)].push(vscode.Uri.joinPath(uri, dirname));
    }

    const flattedFiles = files.flatMap(array => array.sort());

    return flattedFiles;
  }
}

const explorerTreeViewProvider = new _ExplorerTreeViewProvider();

export default explorerTreeViewProvider;
