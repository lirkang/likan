/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT, FALSE, PACKAGE_JSON, TRUE } from '@/constants';
import { formatSize, getConfig, getDocumentComment, getKeys, toFirstUpper } from '@/utils';

import { fileSize, memory } from './statusbar';

export const changeEditor = vscode.window.onDidChangeActiveTextEditor(event => {
  if (!event || !getConfig('fileSize')) return fileSize.hide();

  const { size } = fs.statSync(event.document.uri.fsPath);

  fileSize.text = `$(file-code) ${formatSize(size)}`;
  fileSize.show();
});

export const saveText = vscode.workspace.onDidSaveTextDocument(({ uri }) => {
  if (!getConfig('fileSize')) return fileSize.hide();

  const { size } = fs.statSync(uri.fsPath);

  fileSize.text = `$(file-code) ${formatSize(size)}`;
  fileSize.show();
});

export const Timer = setInterval(() => {
  memory.show();
  memory.text = `${formatSize(os.totalmem() - os.freemem(), FALSE)} / ${formatSize(os.totalmem())}`;
}, 5000);

export const changeConfig = vscode.workspace.onDidChangeConfiguration(() => {
  const fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;

  if (getConfig('fileSize') && fsPath && fs.existsSync(fsPath)) {
    fileSize.show();
  } else {
    fileSize.hide();
  }

  if (getConfig('memory')) {
    memory.show();
  } else {
    memory.hide();
  }
});

export const createFiles = vscode.workspace.onDidCreateFiles(({ files }) => {
  for (const uri of files) {
    const { fsPath } = uri;

    const suffix = path.extname(fsPath);

    if (DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT.includes(suffix) && fs.readFileSync(fsPath).toString().length === 0) {
      fs.writeFileSync(fsPath, getDocumentComment(uri));
    }
  }
});

class ExplorerTreeViewProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem({ dirname, fsPath, type, first }: TreeItem) {
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
  getChildren(element?: TreeItem) {
    const { folders, filterFolders } = getConfig();

    let folder: Array<TreeItem> = [];

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

export const explorerTreeViewProvider = new ExplorerTreeViewProvider();

export const explorerTreeView = vscode.window.createTreeView<TreeItem>('likan-explorer', {
  showCollapseAll: TRUE,
  treeDataProvider: explorerTreeViewProvider,
});

class ScriptTreeViewProvider implements vscode.TreeDataProvider<ScriptsTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ScriptsTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem({ fsPath, first, label, script }: ScriptsTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
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

export const scriptTreeViewProvider = new ScriptTreeViewProvider();

export const scriptsTreeView = vscode.window.createTreeView<ScriptsTreeItem>('likan-scripts', {
  showCollapseAll: TRUE,
  treeDataProvider: scriptTreeViewProvider,
});
