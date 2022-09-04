/**
 * @Author likan
 * @Date 2022/09/03 09:07:03
 * @FilePath D:\CodeSpace\Dev\likan\src\class\EnvironmentProvider.ts
 */

import { EMPTY_STRING, ENV_FILES } from '@/common/constants';
import { getRootPath, toFirstUpper, verifyExistAndNotDirectory } from '@/common/utils';

class EnvironmentProvider implements vscode.CompletionItemProvider {
  #envProperties: Array<vscode.CompletionItem> = [];
  #rootPath = EMPTY_STRING;

  #getEnvProperties() {
    for (const environment of ENV_FILES) {
      const filepath = path.join(this.#rootPath, environment);

      if (!verifyExistAndNotDirectory(filepath)) continue;

      const environments = fs.readFileSync(filepath, 'utf8');

      for (const line of environments.split('\n')) {
        if (line.trim().length === 0 || line.trim().startsWith('#')) continue;

        const indexof = line.indexOf('=');

        if (indexof !== -1) {
          this.#envProperties.push({
            detail: line.slice(indexof + 1, line.length).trim(),
            documentation: toFirstUpper(path.join(this.#rootPath, environment)),
            kind: vscode.CompletionItemKind.Property,
            label: line.slice(0, indexof).trim(),
          });
        }
      }
    }
  }

  #init() {
    this.#envProperties = [];
    this.#rootPath = EMPTY_STRING;
  }

  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    this.#init();

    const rootPath = getRootPath();
    const word = document.lineAt(position).text.slice(0, Math.max(0, position.character)).trim();

    if (!rootPath || !/^.*process.env((\.)|(\[["'`]))$/.test(word)) return;

    this.#rootPath = rootPath;
    this.#getEnvProperties();

    return new vscode.CompletionList(this.#envProperties);
  }
}

const environmentProvider = new EnvironmentProvider();

export default environmentProvider;
