/**
 * @Author likan
 * @Date 2022/09/03 09:07:03
 * @FilePath D:\CodeSpace\Dev\likan\src\class\EnvironmentProvider.ts
 */

import { toString } from 'uint8arrays/to-string';

import { ENV_FILES } from '@/common/constants';
import { exist, getRootPath, toFirstUpper } from '@/common/utils';

class EnvironmentProvider implements vscode.CompletionItemProvider {
  #envProperties: Array<vscode.CompletionItem> = [];

  set envProperty({ fsPath, lineString }: Record<'lineString' | 'fsPath', string>) {
    if (lineString.length === 0 || lineString.startsWith('#') || !lineString.includes('=')) return;

    const indexof = lineString.indexOf('=');
    const [detail, label] = [lineString.slice(indexof + 1, lineString.length), lineString.slice(0, indexof)];

    this.#envProperties.push({
      detail: detail.trim(),
      documentation: toFirstUpper(fsPath),
      kind: vscode.CompletionItemKind.Property,
      label: label.trim(),
    });
  }

  async #getEnvProperties(rootUri: vscode.Uri) {
    for (const environment of ENV_FILES) {
      const filepath = vscode.Uri.joinPath(rootUri, environment);

      if (!exist(filepath)) continue;

      const environments = toString(await vscode.workspace.fs.readFile(filepath), 'utf8');

      for (const lineString of environments.split('\n')) {
        this.envProperty = { fsPath: filepath.fsPath, lineString: lineString.trim() };
      }
    }
  }

  #init() {
    this.#envProperties = [];
  }

  async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const rootPath = getRootPath();
    const word = document.lineAt(position).text.slice(0, Math.max(0, position.character));

    if (!rootPath || !/process.env((\.)|(\[["'`]))$/.test(word.trim())) return;

    await this.#getEnvProperties(vscode.Uri.file(rootPath));

    return new vscode.CompletionList(this.#envProperties);
  }
}

const environmentProvider = new EnvironmentProvider();

export default environmentProvider;
