/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import { Config, DEFAULT_CONFIGS, EMPTY_STRING, FALSE, PACKAGE_JSON, QUOTES, TRUE, UNDEFINED } from '@/constants';

function formatSize(size: number, containSuffix = TRUE, fixedIndex = 2) {
  const [floatSize, suffix] = size < 1024 ** 2 ? [1, 'K'] : size < 1024 ** 3 ? [2, 'M'] : [3, 'G'];

  return util.format('%s %s', (size / 1024 ** floatSize).toFixed(fixedIndex), containSuffix ? suffix : EMPTY_STRING);
}

function toFirstUpper(string_: string) {
  return string_.replace(/./, m => m.toUpperCase());
}

function getRootPath(filepath = EMPTY_STRING, showError = FALSE): string | undefined {
  if (/^\w:\\$/.test(filepath)) return;

  let fsPath: string = filepath;

  if (filepath === EMPTY_STRING) {
    if (!vscode.window.activeTextEditor) return;

    fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;
  }

  if (!fsPath) return;

  try {
    if (fs.statSync(fsPath).isDirectory()) {
      return fs.existsSync(path.join(fsPath, PACKAGE_JSON)) ? fsPath : getRootPath(path.join(fsPath, '..'));
    } else {
      return fsPath.endsWith(PACKAGE_JSON) ? path.dirname(fsPath) : getRootPath(path.join(fsPath, '..'));
    }
  } catch {
    if (showError) vscode.window.showErrorMessage('没有获取到工作区, 请检查是否存在package.json');
  }
}

function addExtension(filepath: string, additionalExtension: Array<string> = []) {
  filepath = path.join(filepath);

  if (verifyExistAndNotDirectory(filepath)) return filepath;

  for (const extension of [...getConfig('exts'), ...additionalExtension]) {
    const files = [`${filepath}${extension}`, `${filepath}/index${extension}`];

    for (const f of files) {
      if (verifyExistAndNotDirectory(f)) return f;
    }
  }
}

interface getConfig {
  <K extends keyof Config>(key: K): Config[K];
  (): { [K in keyof Config]: Config[K] };
}

const getConfig: getConfig = <K extends keyof Config>(key?: K) => {
  const configuration = vscode.workspace.getConfiguration('likan');

  // @ts-ignore
  const unFormatConfigs = getKeys(DEFAULT_CONFIGS).map(k => [k, configuration.get(...DEFAULT_CONFIGS[k])]);

  const configs: Config = Object.fromEntries(unFormatConfigs);

  return key ? configs[key] : configs;
};

function getDocumentComment(uri: vscode.Uri) {
  const towDigit = '2-digit';

  return `/**
 * @Author ${toFirstUpper(getConfig('author'))}
 * @Date ${new Date().toLocaleString(UNDEFINED, {
   day: towDigit,
   hour: towDigit,
   minute: towDigit,
   month: towDigit,
   second: towDigit,
   year: 'numeric',
 })}
 * @FilePath ${toFirstUpper(uri.fsPath)}
 */\n\n`;
}

interface thenableToPromise {
  <T>(function_: Thenable<T | undefined>): Promise<T>;
  <T extends Record<keyof Any, Any>, K extends keyof T>(function_: Thenable<T | undefined>, key: K): Promise<T[K]>;
}

const thenableToPromise: thenableToPromise = <T extends Record<keyof Any, Any>, K extends keyof T>(
  function_: Thenable<T | undefined>,
  key?: K
) => {
  return new Promise<T | T[K]>((rs, rj) => {
    function_.then(result => {
      if (result === UNDEFINED) {
        rj(result);
      } else {
        rs(key ? result[key] : result);
      }
    });
  });
};

function getTargetFilePath(...paths: Array<string>) {
  const filepath = path.join(...paths);

  if (fs.existsSync(filepath)) {
    return fs.statSync(filepath).isFile() ? filepath : addExtension(filepath);
  } else {
    return addExtension(filepath);
  }
}

function verifyExistAndNotDirectory(filepath: string) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isFile();
}

function removeMatchedStringAtStartAndEnd(
  string: string,
  startArray: Array<string> = QUOTES,
  endArray: Array<string> = QUOTES
) {
  if (startArray.some(q => string.startsWith(q))) {
    string = string.slice(1);
  }

  if (endArray.some(q => string.endsWith(q))) {
    string = string.slice(0, -1);
  }

  return string;
}

function openFolder(uri: vscode.Uri, flag = TRUE) {
  if (!uri || !fs.existsSync(uri.fsPath)) return;

  uri = vscode.Uri.file(uri.fsPath);

  vscode.commands.executeCommand('vscode.openFolder', uri, flag);
}

function formatDocument() {
  vscode.commands.executeCommand('editor.action.formatDocument');
}

function addLeadingZero(number: number, length: number) {
  const string = number.toString();

  if (string.length > length) {
    return number.toString();
  }

  return Array.from({ length }).fill(0).join(EMPTY_STRING) + string;
}

function getKeys<K extends keyof Any>(object: Record<K, Any>): Array<K> {
  return Object.keys(object) as Array<K>;
}

export {
  addExtension,
  addLeadingZero,
  formatDocument,
  formatSize,
  getConfig,
  getDocumentComment,
  getKeys,
  getRootPath,
  getTargetFilePath,
  openFolder,
  removeMatchedStringAtStartAndEnd,
  thenableToPromise,
  toFirstUpper,
  verifyExistAndNotDirectory,
};
