/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import {
  Config,
  DEFAULT_CONFIGS,
  EMPTY_ARRAY,
  EMPTY_STRING,
  FALSE,
  PACKAGE_JSON,
  QUOTES,
  TRUE,
  UNDEFINED,
} from './constants';

export function formatSize(size: number, containSuffix = TRUE, fixedIndex = 2) {
  const [floatSize, suffix] = size < 1024 ** 2 ? [1, 'K'] : size < 1024 ** 3 ? [2, 'M'] : [3, 'G'];

  return util.format('%s %s', (size / 1024 ** floatSize).toFixed(fixedIndex), containSuffix ? suffix : EMPTY_STRING);
}

export function toFirstUpper(string: string) {
  return string.replace(/./, m => m.toUpperCase());
}

export function getRootPath(filepath = EMPTY_STRING, showError = FALSE): string | undefined {
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

export function addExtension(filepath: string, additionalExtension: ReadonlyArray<string> = EMPTY_ARRAY) {
  filepath = path.join(filepath);

  if (verifyExistAndNotDirectory(filepath)) return vscode.Uri.file(filepath);

  for (const extension of [...getConfig('exts'), ...additionalExtension]) {
    const files = [`${filepath}${extension}`, `${filepath}/index${extension}`, `${filepath}/index.d${extension}`];

    for (const fsPath of files) {
      if (verifyExistAndNotDirectory(fsPath)) return vscode.Uri.file(fsPath);
    }
  }
}

interface getConfig {
  <K extends keyof Config>(key: K, scope?: vscode.Uri): Config[K];
  (scope?: vscode.Uri): Config;
}

export const getConfig: getConfig = <K extends keyof Config>(key?: K | vscode.Uri, scope?: vscode.Uri) => {
  const uri = scope ?? (typeof key === 'string' ? UNDEFINED : key);

  const configuration = vscode.workspace.getConfiguration('likan', uri);

  // @ts-ignore
  const unFormatConfigs = getKeys(DEFAULT_CONFIGS).map(k => [k, configuration.get(...DEFAULT_CONFIGS[k])]);

  const configs: Config = Object.fromEntries(unFormatConfigs);

  return typeof key === 'string' ? configs[key] : configs;
};

export function getDocumentCommentSnippet(uri: vscode.Uri) {
  return new vscode.SnippetString(`/**
 * @Author ${toFirstUpper(getConfig('author', uri))}
 * @Date ${getDateString()}
 * @FilePath ${toFirstUpper(uri.fsPath)}
 * @Description $1
 */\n\n$0\n`);
}

export function getDateString(date = Date.now()) {
  const towDigit = '2-digit';

  return new Date(date).toLocaleString(UNDEFINED, {
    day: towDigit,
    hour: towDigit,
    minute: towDigit,
    month: towDigit,
    second: towDigit,
    year: 'numeric',
  });
}

export function getTargetFilePath(...paths: Array<string>) {
  const filepath = path.join(...paths);

  if (fs.existsSync(filepath)) {
    return fs.statSync(filepath).isFile() ? vscode.Uri.file(filepath) : addExtension(filepath);
  } else {
    return addExtension(filepath);
  }
}

export function verifyExistAndNotDirectory(filepath: string) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isFile();
}

export function verifyExistAndNotFile(filepath: string) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
}

export function removeMatchedStringAtStartAndEnd(
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

export function openFolder(uri: vscode.Uri, flag = TRUE) {
  if (!uri || !exist(uri)) return;

  uri = vscode.Uri.file(uri.fsPath);

  vscode.commands.executeCommand('vscode.openFolder', uri, flag);
}

export async function formatDocument() {
  await vscode.commands.executeCommand('editor.action.formatDocument');
}

export function addLeadingZero(number: number, length: number) {
  const string = number.toString();

  if (string.length > length) {
    return number.toString();
  }

  return Array.from({ length: length - string.length }, () => 0).join(EMPTY_STRING) + string;
}

export function getKeys<K extends keyof Common.Any>(object: Record<K, Common.Any>) {
  return Object.keys(object) as Array<K>;
}

export async function deleteLeft() {
  await vscode.commands.executeCommand('deleteLeft');
}

export function uniq<T>(array: Array<T>, conditions: Array<keyof T>): [Array<T>, Array<number>] {
  if (conditions.length === 0) return [array, []];

  const map = new Map<string, void>();
  const indexes: Array<number> = [];

  const filteredArray = array.filter((object, index) => {
    const mapKey = conditions.map(key => JSON.stringify(object[key])).join(' ');

    if (map.has(mapKey)) {
      indexes.push(index);
      return FALSE;
    } else {
      map.set(mapKey);
      return TRUE;
    }
  });

  return [filteredArray, indexes];
}

export function toSafetySnippetString(snippet: string) {
  return snippet.replaceAll('$', '\\$').replaceAll(/\*{3}(\d)/g, '$$1');
}

export function exist(uri: vscode.Uri) {
  return fs.existsSync(uri.fsPath);
}
