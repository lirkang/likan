/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @FilePath D:\CodeSpace\Dev\likan\src\common\listeners.ts
 */

import { DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT, FALSE } from './constants';
import { fileSize, memory } from './statusbar';
import { formatSize, getConfig, getDocumentComment } from './utils';

const changeEditor = vscode.window.onDidChangeActiveTextEditor(async event => {
  if (!event || !getConfig('fileSize')) return fileSize.hide();

  if (!fs.existsSync(event.document.uri.fsPath)) return;

  const { size } = await vscode.workspace.fs.stat(event.document.uri);

  fileSize.text = `$(file-code) ${formatSize(size)}`;
  fileSize.show();
});

const saveText = vscode.workspace.onDidSaveTextDocument(async ({ uri }) => {
  if (!getConfig('fileSize')) return fileSize.hide();

  const { size } = await vscode.workspace.fs.stat(uri);

  fileSize.text = `$(file-code) ${formatSize(size)}`;
  fileSize.show();
});

export const Timer = setInterval(() => {
  memory.show();
  memory.text = `${formatSize(os.totalmem() - os.freemem(), FALSE)} / ${formatSize(os.totalmem())}`;
}, 5000);

const changeConfig = vscode.workspace.onDidChangeConfiguration(() => {
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

const createFiles = vscode.workspace.onDidCreateFiles(({ files }) => {
  for (const uri of files) {
    const { fsPath } = uri;

    const suffix = path.extname(fsPath);

    if (DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT.includes(suffix) && !fs.readFileSync(fsPath, 'utf8')) {
      fs.writeFileSync(fsPath, getDocumentComment(uri));
    }
  }
});

const listeners = [changeConfig, changeEditor, createFiles, saveText];

export default listeners;
