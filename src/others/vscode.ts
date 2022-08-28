/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { freemem, totalmem } from 'os';

import { DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT, FALSE, PACKAGE_JSON, TRUE } from '@/constants';
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

export const explorerTreeView = vscode.window.createTreeView<TreeItem>('likan-explorer', {
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
        .filter(({ fsPath }) => !filterFolders.find(f => new RegExp(f.replaceAll('.', '\\.')).test(fsPath)))
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

export const scriptsTreeView = vscode.window.createTreeView<ScriptsTreeItem>('likan-scripts', {
  showCollapseAll: true,
  treeDataProvider: {
    getChildren(element?) {
      const { filterFolders } = getConfig();

      if (!element) {
        const { workspaceFolders } = vscode.workspace;

        if (!workspaceFolders?.length) return [];

        return workspaceFolders.map(({ uri: { fsPath } }) => ({ fsPath }));
      } else {
        const { fsPath } = element;

        const filepath = path.join(fsPath, PACKAGE_JSON);

        if (fs.existsSync(filepath)) {
          const { scripts } = JSON.parse(fs.readFileSync(filepath, 'utf-8')) ?? {};

          return Object.keys(scripts).map(k => ({ fsPath: filepath, label: k, script: scripts[k] }));
        } else {
          return fs
            .readdirSync(fsPath)
            .filter(d => fs.statSync(path.join(fsPath, d)).isDirectory())
            .map(d => ({ fsPath: path.join(fsPath, d) }))
            .filter(({ fsPath }) => !filterFolders.find(f => new RegExp(f.replaceAll('.', '\\.')).test(fsPath)));
        }
      }
    },
    getTreeItem({ fsPath, script, label }) {
      const { Collapsed, None } = vscode.TreeItemCollapsibleState;

      const treeItem = new vscode.TreeItem(
        vscode.Uri.parse(path.basename(fsPath)),
        fs.statSync(fsPath).isDirectory() ? Collapsed : None
      );

      treeItem.label = label ?? path.basename(fsPath);
      treeItem.tooltip = toFirstUpper(fsPath);

      if (script) {
        treeItem.command = { command: 'likan.other.scriptsRunner', arguments: [fsPath, label], title: '执行命令' };
      }

      return treeItem;
    },
  },
});
