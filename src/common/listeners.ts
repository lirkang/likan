/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @FilePath D:\CodeSpace\Dev\likan\src\common\listeners.ts
 */

import { DOC_COMMENT_EXT, FALSE, UNDEFINED } from './constants';
import { fileSize, memory } from './statusbar';
import { formatSize, getConfig, getDocumentComment, toFirstUpper } from './utils';

async function updateFileSize(uri?: vscode.Uri, condition?: boolean) {
  if (!uri || !fs.existsSync(uri.fsPath)) return fileSize.setVisible(false);
  if (condition !== UNDEFINED) fileSize.setVisible(condition);

  const { size } = await vscode.workspace.fs.stat(uri);

  if (os.platform() === 'win32') {
    fileSize.setCommand({ arguments: [uri], command: 'likan.open.explorer', title: '打开文件' });
  }

  fileSize.setText(formatSize(size));
  fileSize.setTooltip(toFirstUpper(uri?.fsPath ?? ''));
}

const changeEditor = vscode.window.onDidChangeActiveTextEditor(async event => {
  const condition = event && fs.existsSync(event.document.uri.fsPath) && getConfig('fileSize');

  updateFileSize(event?.document.uri, condition);
});

const saveText = vscode.workspace.onDidSaveTextDocument(async ({ uri }) => {
  updateFileSize(uri);
});

const changeConfig = vscode.workspace.onDidChangeConfiguration(() => {
  const config = getConfig();

  updateFileSize(vscode.window.activeTextEditor?.document.uri, config.fileSize);
  memory.setVisible(config.memory);
});

export const Timer = setInterval(() => {
  const totalmem = os.totalmem();
  const freemem = os.freemem();

  if (os.platform() === 'win32') {
    memory.setCommand({ arguments: [], command: 'taskmgr', title: '打开文件' });
  }
  memory.setVisible(getConfig('memory'));
  memory.setText(`${formatSize(totalmem - freemem, FALSE)} / ${formatSize(totalmem)}`);
  memory.setTooltip(`${((freemem / totalmem) * 100).toFixed(2)} %`);
}, 2000);

const createFiles = vscode.workspace.onDidCreateFiles(({ files }) => {
  for (const { fsPath } of files) {
    const suffix = path.extname(fsPath);

    if (DOC_COMMENT_EXT.includes(suffix) && !fs.readFileSync(fsPath, 'utf8')) {
      fs.writeFileSync(fsPath, getDocumentComment(fsPath));
    }
  }
});

const listeners = [changeConfig, changeEditor, createFiles, saveText];

export default listeners;
