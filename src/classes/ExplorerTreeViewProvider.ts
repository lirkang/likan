/**
 * @Author likan
 * @Date 2022/09/03 09:08:08
 * @Filepath likan/src/classes/ExplorerTreeViewProvider.ts
 */

import { isUndefined, unary } from 'lodash-es';
import { Utils } from 'vscode-uri';

import { exists } from '@/common/utils';

class ExplorerTreeViewProvider implements vscode.TreeDataProvider<vscode.Uri> {
  #onDidChangeTreeData = new vscode.EventEmitter<vscode.Uri | void>();

  onDidChangeTreeData = this.#onDidChangeTreeData.event;

  #baseFolder = Configuration.folders.map(unary(vscode.Uri.file)).filter(unary(exists));

  refresh = () => {
    this.#onDidChangeTreeData.fire();
  };

  async getTreeItem (uri: vscode.Uri) {
    const isBaseFolder = this.#baseFolder.some(({ fsPath }) => fsPath === uri.fsPath);
    const basename = Utils.basename(uri);
    const { type } = await vscode.workspace.fs.stat(uri);
    const { Collapsed, Expanded, None } = vscode.TreeItemCollapsibleState;
    const { Directory, File } = vscode.FileType;
    const treeItem = new vscode.TreeItem(uri);

    if (isBaseFolder) treeItem.collapsibleState = Expanded;
    else if (type === Directory) {
      const { length } = await vscode.workspace.fs.readDirectory(uri);

      if (length === 0) {
        treeItem.collapsibleState = Expanded;
        treeItem.description = '空文件夹';
      } else treeItem.collapsibleState = Collapsed;
    } else treeItem.collapsibleState = None;

    if (type === Directory) treeItem.contextValue = `directory-${basename}`;
    else if (type === File) {
      treeItem.contextValue = `file-${basename}`;
      treeItem.command = { arguments: [ uri ], command: 'vscode.open', title: '打开文件' };
    }

    return treeItem;
  }

  async getChildren (uri?: vscode.Uri) {
    if (isUndefined(uri)) return this.#baseFolder;

    const files: [Array<vscode.Uri>, Array<vscode.Uri>] = [ [], [] ];
    const directories = await vscode.workspace.fs.readDirectory(uri);
    const filleterRegExp = new RegExp(Configuration.filterFolders.join('|').replaceAll('.', '\\.'));
    const { File, SymbolicLink, Unknown } = vscode.FileType;

    for (const [ dirname, fileType ] of directories) {
      if (filleterRegExp.test(dirname) || [ Unknown, SymbolicLink ].includes(fileType)) continue;

      files[Number(fileType === File)].push(vscode.Uri.joinPath(uri, dirname));
    }

    const flattedFiles = files.flatMap(array => array.sort());

    return flattedFiles;
  }
}

const explorerTreeViewProvider = new ExplorerTreeViewProvider();

export default explorerTreeViewProvider;
