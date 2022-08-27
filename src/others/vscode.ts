/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { freemem, totalmem } from 'os';

import { DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT, FALSE, TRUE } from '@/constants';
import { formatSize, getConfig, getDocComment, toFirstUpper } from '@/utils';

import { fileSize, memory } from './statusbar';

export const changeEditor = vscode.window.onDidChangeActiveTextEditor(e => {
  if (!e || !getConfig('fileSize')) return fileSize.hide();

  const { size } = fs.statSync(e.document.uri.fsPath);

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
  memory.text = `${formatSize(totalmem() - freemem(), FALSE)} / ${formatSize(totalmem())}`;
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
  files.forEach(({ fsPath }) => {
    const suffix = path.extname(fsPath);

    if (DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT.includes(suffix) && !fs.readFileSync(fsPath).toString().length) {
      fs.writeFileSync(fsPath, getDocComment(fsPath));
    }
  });
});

export const treeView = vscode.window.createTreeView<TreeItem>('likan-explorer', {
  showCollapseAll: TRUE,
  treeDataProvider: {
    getChildren(element?: TreeItem) {
      const { folders, filterFolders } = getConfig();

      let folder: Array<TreeItem> = [];

      if (!element) {
        const children = folders.filter(fs.existsSync);

        folder = children.map(f => ({ dirname: f, fsPath: f, type: 'folder', first: TRUE }));
      } else {
        const { fsPath } = element;

        folder = fs.readdirSync(fsPath).map(dirname => ({
          dirname,
          fsPath: path.join(fsPath, dirname),
          type: fs.statSync(path.join(fsPath, dirname)).isDirectory() ? 'folder' : 'file',
        }));
      }

      return folder
        .filter(({ fsPath }) => !filterFolders.find(f => new RegExp(f).test(fsPath)))
        .sort(({ fsPath: preF }, { fsPath: curF }) => {
          const preFStat = fs.statSync(preF);
          const curFStat = fs.statSync(curF);

          return preFStat.isDirectory() && curFStat.isFile() ? -1 : 1;
        });
    },

    getTreeItem({ dirname, type, first, fsPath }) {
      const { Collapsed, None, Expanded } = vscode.TreeItemCollapsibleState;

      const collapsedType = first ? Expanded : type === 'folder' ? Collapsed : None;
      const treeItem = new vscode.TreeItem(vscode.Uri.parse(dirname), collapsedType);

      treeItem.tooltip = toFirstUpper(fsPath);

      if (type === 'file') {
        treeItem.command = { command: 'vscode.open', title: '打开文件', arguments: [vscode.Uri.file(fsPath)] };
      }

      if (first) {
        treeItem.label = toFirstUpper(dirname);
      }

      return treeItem;
    },
  },
});
