/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import { DEFAULT_CONFIGS, EMPTY_STRING, FALSE, PACKAGE_JSON, QUOTES, TRUE, UNDEFINED } from '@/constants';

function formatSize(size: number, containSuffix = TRUE, fixedIndex = 2) {
  const [floatSize, suffix] =
    size < 1024 ** 2 ? [size / 1024, 'K'] : size < 1024 ** 3 ? [size / 1024 ** 2, 'M'] : [size / 1024 ** 3, 'G'];

  return util.format('%s %s', floatSize.toFixed(fixedIndex), containSuffix ? suffix : EMPTY_STRING);
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
  (): Config;
  <K extends keyof Config>(key: K): Config[K];
}

const getConfig: getConfig = <K extends keyof Config>(key?: K) => {
  const configuration = vscode.workspace.getConfiguration('likan');

  // @ts-ignore
  const unFormatConfigs = Object.keys(DEFAULT_CONFIGS).map(k => [k, configuration.get(...DEFAULT_CONFIGS[k])]);

  const configs: Config = Object.fromEntries(unFormatConfigs);

  return key ? configs[key] : configs;
};

function getDocumentComment(fsPath: string) {
  const leadingZero = '2-digit';

  return `/**
 * @Author ${getConfig('author')}
 * @Date ${new Date().toLocaleString(UNDEFINED, {
   day: leadingZero,
   hour: leadingZero,
   minute: leadingZero,
   month: leadingZero,
   second: leadingZero,
   year: 'numeric',
 })}
 * @FilePath ${toFirstUpper(fsPath)}
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
    return fs.statSync(filepath).isDirectory() ? addExtension(filepath) : filepath;
  } else {
    return addExtension(filepath);
  }
}

function verifyExistAndNotDirectory(filepath: string) {
  return fs.existsSync(filepath) && !fs.statSync(filepath).isDirectory();
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

function openFolder(fsPath: string, flag = TRUE) {
  if (!fsPath || !fs.existsSync(fsPath)) return;

  vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(fsPath), flag);
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

export {
  addExtension,
  addLeadingZero,
  formatDocument,
  formatSize,
  getConfig,
  getDocumentComment,
  getRootPath,
  getTargetFilePath,
  openFolder,
  removeMatchedStringAtStartAndEnd,
  thenableToPromise,
  toFirstUpper,
  verifyExistAndNotDirectory,
};
