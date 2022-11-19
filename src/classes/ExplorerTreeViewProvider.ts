/**
 * @Author likan
 * @Date 2022/09/03 09:08:08
 * @Filepath likan/src/classes/ExplorerTreeViewProvider.ts
 */

import { isUndefined, unary } from 'lodash-es';
import numeral from 'numeral';
import { Utils } from 'vscode-uri';

import { exists } from '@/common/utils';

class _ExplorerTreeViewProvider implements vscode.TreeDataProvider<vscode.Uri> {
  #onDidChangeTreeData = new vscode.EventEmitter<vscode.Uri | void>();

  onDidChangeTreeData = this.#onDidChangeTreeData.event;

  get #baseFolder () {
    return Configuration.FOLDERS.map(unary(vscode.Uri.file)).filter(unary(exists));
  }

  refresh = () => {
    this.#onDidChangeTreeData.fire();
  };

  async getTreeItem (uri: vscode.Uri) {
    const isBaseFolder = (<Array<vscode.Uri>> this.#baseFolder).some(({ fsPath }) => fsPath === uri.fsPath);
    const basename = Utils.basename(uri);
    const { type } = await vscode.workspace.fs.stat(uri);
    const { Collapsed, Expanded, None } = vscode.TreeItemCollapsibleState;
    const { Directory, File } = vscode.FileType;
    const treeItem = new vscode.TreeItem(uri);

    if (isBaseFolder) treeItem.collapsibleState = Expanded;
    else if (type === Directory) {
      const directories = await vscode.workspace.fs.readDirectory(uri);

      if (Configuration.DESCRIPTION) {
        const { length: directionLength } = directories.filter(([ , type ]) => type === Directory);
        const { length: fileLength } = directories.filter(([ , type ]) => type === File);

        if (directories.length === 0) {
          treeItem.collapsibleState = Expanded;
          treeItem.description = '空文件夹';
        } else treeItem.description = `${directionLength}个文件夹 ${fileLength}个文件`;
      }

      treeItem.collapsibleState = Collapsed;
    } else {
      if (Configuration.DESCRIPTION) {
        const { size } = await vscode.workspace.fs.stat(uri);

        treeItem.description = `文件大小 ${numeral(size).format('0.[000] b')}`;
      }

      treeItem.collapsibleState = None;
    }

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
    const filleterRegExp =
      Configuration.FILTER_FOLDERS.length > 0
        ? new RegExp(Configuration.FILTER_FOLDERS.join('|').replaceAll('.', '\\.'))
        : /^$/s;
    const { File, SymbolicLink, Unknown } = vscode.FileType;

    for (const [ dirname, fileType ] of directories) {
      if (filleterRegExp.test(dirname) || [ Unknown, SymbolicLink ].includes(fileType)) continue;

      files[Number(fileType === File)].push(vscode.Uri.joinPath(uri, dirname));
    }

    const flattedFiles = files.flatMap(array => array.sort());

    return flattedFiles;
  }
}

const explorerTreeViewProvider = new _ExplorerTreeViewProvider();

export default explorerTreeViewProvider;
