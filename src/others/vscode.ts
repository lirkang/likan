/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT } from '@/constants';
import { getConfig, getDocComment, toFirstUpper } from '@/utils';

vscode.workspace.onDidCreateFiles(({ files }) => {
  files.forEach(({ fsPath }) => {
    const suffix = path.extname(fsPath);

    if (DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT.includes(suffix) && !fs.readFileSync(fsPath, 'utf-8').toString().length) {
      fs.writeFileSync(fsPath, getDocComment(fsPath));
    }
  });
});

vscode.window.createTreeView<TreeItem>('likan-explorer', {
  showCollapseAll: true,
  treeDataProvider: {
    getChildren(element?: TreeItem) {
      const { folders, filterFolders } = getConfig();

      let folder: Array<TreeItem> = [];

      if (!element) {
        // const dirs: Array<[string, Array<string>]> = folders.filter(fs.existsSync).map(f => [f, fs.readdirSync(f)]);

        // const children = dirs.reduce<Array<string>>((p, [f, c]) => p.concat(c.map(c => path.join(f, c))), []);

        const children = folders.filter(fs.existsSync);

        folder = children.map(f => ({ dirname: f, fsPath: f, type: 'folder', first: true }));
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
