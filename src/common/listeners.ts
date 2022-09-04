/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @FilePath D:\CodeSpace\Dev\likan\src\common\listeners.ts
 */

import { DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT, FALSE, TRUE } from './constants';
import { fileSize, memory } from './statusbar';
import { formatSize, getConfig, getDocumentComment } from './utils';

const changeEditor = vscode.window.onDidChangeActiveTextEditor(async event => {
  if (!event || !fs.existsSync(event.document.uri.fsPath) || !getConfig('fileSize')) return fileSize.setVisible(FALSE);

  const { size } = await vscode.workspace.fs.stat(event.document.uri);

  fileSize.setText(formatSize(size));
  fileSize.setVisible(TRUE);
});

const saveText = vscode.workspace.onDidSaveTextDocument(async ({ uri }) => {
  const { size } = await vscode.workspace.fs.stat(uri);

  fileSize.setText(formatSize(size));
});

const changeConfig = vscode.workspace.onDidChangeConfiguration(() => {
  const config = getConfig();

  const fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;
  const isShowFileSize = Boolean(config.fileSize && fsPath && fs.existsSync(fsPath));

  fileSize.setVisible(isShowFileSize);
  memory.setVisible(config.memory);
});

export const Timer = setInterval(() => {
  memory.setVisible(TRUE);
  memory.setText(`${formatSize(os.totalmem() - os.freemem(), FALSE)} / ${formatSize(os.totalmem())}`);
}, 5000);

const createFiles = vscode.workspace.onDidCreateFiles(({ files }) => {
  for (const { fsPath } of files) {
    const suffix = path.extname(fsPath);

    if (DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT.includes(suffix) && !fs.readFileSync(fsPath, 'utf8')) {
      fs.writeFileSync(fsPath, getDocumentComment(fsPath));
    }
  }
});

const listeners = [changeConfig, changeEditor, createFiles, saveText];

export default listeners;
