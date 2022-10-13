/**
 * @Author likan
 * @Date 2022/09/03 09:08:08
 * @Filepath likan/src/classes/ExplorerTreeViewProvider.ts
 */

import { forEach, unary } from 'lodash-es';
import { Utils } from 'vscode-uri';

import { exist, toNormalizePath } from '@/common/utils';

function getFolders(refresh: () => void) {
  const folders = Configuration.folders.map(unary(vscode.Uri.file)).filter(unary(exist));

  forEach(folders, baseUri =>
    vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(baseUri, '*')).onDidChange(refresh)
  );

  return folders;
}

class ExplorerTreeViewProvider implements vscode.TreeDataProvider<vscode.Uri> {
  #_onDidChangeTreeData = new vscode.EventEmitter<vscode.Uri | void>();
  onDidChangeTreeData = this.#_onDidChangeTreeData.event;

  refresh = () => {
    this.#_onDidChangeTreeData.fire();
  };

  #baseFolder = getFolders(this.refresh);

  async getTreeItem(uri: vscode.Uri) {
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
      treeItem.command = { arguments: [uri], command: 'vscode.open', title: '打开文件' };
    } else {
      treeItem.contextValue = `directory-${basename}`;
    }

    return treeItem;
  }

  async getChildren(uri?: vscode.Uri) {
    if (uri) {
      const files: [Array<vscode.Uri>, Array<vscode.Uri>] = [[], []];
      const directories = await vscode.workspace.fs.readDirectory(uri);
      const filleterRegExp = new RegExp(Configuration.filterFolders.join('|').replaceAll('.', '\\.'));
      const { File, SymbolicLink, Unknown } = vscode.FileType;

      for (const [dirname, fileType] of directories) {
        if (filleterRegExp.test(dirname) || [Unknown, SymbolicLink].includes(fileType)) continue;

        files[Number(fileType === File)].push(vscode.Uri.joinPath(uri, dirname));
      }

      return files.flatMap(array => array.sort());
    }

    return this.#baseFolder;
  }
}

const explorerTreeViewProvider = new ExplorerTreeViewProvider();

export default explorerTreeViewProvider;
