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

      if (verifyExistAndNotDirectory(filepath)) {
        const fileData = fs.readFileSync(filepath, 'utf8');

        if (fileData.trim()) {
          for (let s of fileData.split('\n')) {
            s = s.trim();

            const indexof = s.indexOf('=');

            if (indexof !== -1 && !s.startsWith('#')) {
              this.#envProperties.push({
                detail: s.slice(indexof + 1, s.length).trim(),
                documentation: toFirstUpper(path.join(this.#rootPath, environment)),
                kind: vscode.CompletionItemKind.Property,
                label: s.slice(0, indexof).trim(),
              });
            }
          }
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

    if (!rootPath) return;

    if (word.endsWith('process.env.') || word.endsWith('process.env[\'')) {
      this.#rootPath = rootPath;

      this.#getEnvProperties();

      return new vscode.CompletionList(this.#envProperties);
    }
  }
}

const environmentProvider = new EnvironmentProvider();

export default environmentProvider;
