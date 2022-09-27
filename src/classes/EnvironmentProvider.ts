/**
 * @Author likan
 * @Date 2022/09/03 09:07:03
 * @Filepath likan/src/classes/EnvironmentProvider.ts
 */

import { toString } from 'uint8arrays';
import { Utils } from 'vscode-uri';

import { ENV_FILES } from '@/common/constants';
import { exist, getRootUri } from '@/common/utils';

class EnvironmentProvider implements vscode.CompletionItemProvider {
  #envProperties: Array<vscode.CompletionItem> = [];

  set envProperty({ uri, lineString }: { lineString: string; uri: vscode.Uri }) {
    if (lineString.startsWith('#') || !lineString.includes('=')) return;

    const indexof = lineString.indexOf('=');
    const [detail, label] = [lineString.slice(indexof + 1, lineString.length), lineString.slice(0, indexof)];

    this.#envProperties.push({
      detail: detail.trim(),
      documentation: new vscode.MarkdownString(`[${Utils.basename(uri)}](${uri})`),
      kind: vscode.CompletionItemKind.Property,
      label: label.trim(),
    });
  }

  async #getEnvProperties(rootUri: vscode.Uri) {
    for (const environment of ENV_FILES) {
      const fileUri = vscode.Uri.joinPath(rootUri, environment);

      if (!exist(fileUri)) continue;

      const environments = toString(await vscode.workspace.fs.readFile(fileUri), 'utf8').split('\n');

      for (const lineString of environments.filter(Boolean).map(string => string.trim())) {
        this.envProperty = { lineString, uri: fileUri };
      }
    }
  }

  #init() {
    this.#envProperties = [];
  }

  async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const rootUri = await getRootUri();
    const word = document.lineAt(position).text.slice(0, Math.max(0, position.character));

    if (!rootUri || !/process.env((\.)|(\[["'`]))$/.test(word.trim())) return;

    await this.#getEnvProperties(rootUri);

    return new vscode.CompletionList(this.#envProperties);
  }
}

const environmentProvider = new EnvironmentProvider();

export default environmentProvider;
