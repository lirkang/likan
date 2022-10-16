/**
 * @Author likan
 * @Date 2022/09/03 09:08:08
 * @Filepath likan/src/classes/ExplorerTreeViewProvider.ts
 */

import { isUndefined, unary } from 'lodash-es';
import { Utils } from 'vscode-uri';

import { exists, toNormalizePath } from '@/common/utils';

class ExplorerTreeViewProvider implements vscode.TreeDataProvider<vscode.Uri> {
  #onDidChangeTreeData = new vscode.EventEmitter<vscode.Uri | void>();

  onDidChangeTreeData = this.#onDidChangeTreeData.event;

  #baseFolder = Configuration.folders.map(unary(vscode.Uri.file)).filter(unary(exists));

  refresh = () => {
    this.#onDidChangeTreeData.fire();
  };

  async getTreeItem (uri: vscode.Uri) {
    const basename = Utils.basename(uri);
    const { type } = await vscode.workspace.fs.stat(uri);
    const isBaseFolder = this.#baseFolder.some(({ fsPath }) => fsPath === uri.fsPath);
    const { Collapsed, Expanded, None } = vscode.TreeItemCollapsibleState;
    const { File } = vscode.FileType;
    const treeItem = new vscode.TreeItem(uri, isBaseFolder ? Expanded : type === File ? None : Collapsed);

    treeItem.tooltip = toNormalizePath(uri);
    treeItem.label = basename;

    if (type === File) {
      treeItem.contextValue = `file-${basename}`;
      treeItem.command = { arguments: [ uri ], command: 'vscode.open', title: '打开文件' };
    } else treeItem.contextValue = `directory-${basename}`;

    return treeItem;
  }

  async getChildren (uri?: vscode.Uri) {
    if (isUndefined(uri)) return this.#baseFolder;

    const files: [Array<vscode.Uri>, Array<vscode.Uri>] = [ [], [] ];
    const directories = await vscode.workspace.fs.readDirectory(uri);
    const filleterRegExp = new RegExp(Configuration.filterFolders.join('|').replaceAll('.', '\\.'), 'u');
    const { File, SymbolicLink, Unknown } = vscode.FileType;

    for (const [ dirname, fileType ] of directories) {
      if (filleterRegExp.test(dirname) || [ Unknown, SymbolicLink ].includes(fileType)) continue;

      files[Number(fileType === File)].push(vscode.Uri.joinPath(uri, dirname));
    }

    return files.flatMap(array => array.sort());
  }
}

const explorerTreeViewProvider = new ExplorerTreeViewProvider();

export default explorerTreeViewProvider;
