/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @FilePath D:\CodeSpace\Dev\likan\src\common\listeners.ts
 */

import { DOC_COMMENT_EXT, EMPTY_STRING, FALSE, UNDEFINED } from './constants';
import { fileSize, memory } from './statusbar';
import { formatSize, getConfig, getDocumentComment, toFirstUpper } from './utils';

async function updateFileSize(uri?: vscode.Uri, condition?: boolean) {
  if (!uri || !fs.existsSync(uri.fsPath)) return fileSize.setVisible(FALSE);
  if (condition !== UNDEFINED) fileSize.setVisible(condition);

  const { size } = await vscode.workspace.fs.stat(uri);

  fileSize.setCommand({ arguments: [uri], command: 'revealFileInOS', title: '打开文件' });

  fileSize.setText(formatSize(size));
  fileSize.setTooltip(toFirstUpper(uri?.fsPath ?? EMPTY_STRING));
}

const changeEditor = vscode.window.onDidChangeActiveTextEditor(async event => {
  if (!event) return fileSize.setVisible(FALSE);

  const { uri } = event.document;
  const suffix = path.extname(uri.fsPath);
  const condition = fs.existsSync(uri.fsPath) && getConfig('fileSize');

  updateFileSize(event?.document.uri, condition);

  if (!getConfig('comment') || !DOC_COMMENT_EXT.includes(suffix)) return;

  const documentString = fs.readFileSync(uri.fsPath, 'utf8');

  if (/(^\s+$)|(^$)/.test(documentString)) {
    fs.writeFileSync(uri.fsPath, getDocumentComment(uri));
  }
});

const saveText = vscode.workspace.onDidSaveTextDocument(({ uri }) => updateFileSize(uri));

const changeConfig = vscode.workspace.onDidChangeConfiguration(() => {
  const config = getConfig();

  updateFileSize(vscode.window.activeTextEditor?.document.uri, config.fileSize);
  memory.setVisible(config.memory);
});

export const Timer = setInterval(() => {
  const totalmem = os.totalmem();
  const freemem = os.freemem();

  memory.setVisible(getConfig('memory'));
  memory.setText(`${formatSize(totalmem - freemem, FALSE)} / ${formatSize(totalmem)}`);
  memory.setTooltip(`${(((totalmem - freemem) / totalmem) * 100).toFixed(2)} %`);
}, 2000);

const listeners = [changeConfig, changeEditor, saveText];

export default listeners;
