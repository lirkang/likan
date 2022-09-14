/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import dayjs from 'dayjs';
import { existsSync } from 'node:fs';
import { format } from 'node:util';
import { URI, Utils } from 'vscode-uri';

import { Config, DEFAULT_CONFIGS, EMPTY_STRING, QUOTES, VOID } from './constants';
export function formatSize(size: number, containSuffix = true, fixedIndex = 2) {
  const [floatSize, suffix] = size < 1024 ** 2 ? [1, 'K'] : size < 1024 ** 3 ? [2, 'M'] : [3, 'G'];

  return format('%s %s', (size / 1024 ** floatSize).toFixed(fixedIndex), containSuffix ? suffix : EMPTY_STRING);
}

export function toFirstUpper(string: string) {
  return string.replace(/./, m => m.toUpperCase());
}

export async function getRootUri(
  uri = vscode.window.activeTextEditor?.document.uri,
  [currentCount, maxCount]: [number, number] = [0, 5],
  showError = false
): Promise<vscode.Uri | undefined> {
  if (!uri) return;
  if (currentCount >= maxCount) return;

  try {
    const { type } = await vscode.workspace.fs.stat(uri);

    if (type === vscode.FileType.Directory) {
      return exist(vscode.Uri.joinPath(uri, 'package.json'))
        ? uri
        : getRootUri(vscode.Uri.joinPath(uri, '..'), [++currentCount, maxCount]);
    } else {
      return Utils.basename(uri) === 'package.json'
        ? Utils.dirname(uri)
        : getRootUri(Utils.dirname(uri), [++currentCount, maxCount]);
    }
  } catch {
    if (showError) vscode.window.showErrorMessage('没有获取到工作区, 请检查是否存在package.json');

    return;
  }
}

export async function addExtension(uri: vscode.Uri, additionalExtension: ReadonlyArray<string> = []) {
  if (exist(uri)) return uri;

  for (const extension of [...getConfig('exts'), ...additionalExtension]) {
    const files = [`${uri.fsPath}${extension}`, `${uri.fsPath}/index${extension}`, `${uri.fsPath}/index.d${extension}`];

    for (const file of files) {
      const fileUri = vscode.Uri.file(file);

      if (exist(fileUri)) return fileUri;
    }
  }
}

interface getConfig {
  <K extends keyof Config>(key: K, scope?: vscode.Uri): Config[K];
  (scope?: vscode.Uri): Config;
}

export const getConfig: getConfig = <K extends keyof Config>(key?: K | vscode.Uri, scope?: vscode.Uri) => {
  const uri = scope ?? (typeof key === 'string' ? VOID : key);

  const configuration = vscode.workspace.getConfiguration('likan', uri);

  // @ts-ignore
  const unFormatConfigs = getKeys(DEFAULT_CONFIGS).map(k => [k, configuration.get(...DEFAULT_CONFIGS[k])]);

  const configs: Config = Object.fromEntries(unFormatConfigs);

  return typeof key === 'string' ? configs[key] : configs;
};

export function getDateString(date = Date.now()) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export async function getTargetFilePath(uri: vscode.Uri, ...paths: Array<string>) {
  const fileUri = vscode.Uri.joinPath(uri, ...paths);

  if (!exist(fileUri)) return addExtension(fileUri);

  const { type } = await vscode.workspace.fs.stat(fileUri);

  return type === vscode.FileType.File ? fileUri : addExtension(fileUri);
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

export function openFolder(uri: vscode.Uri, flag: boolean) {
  if (!uri || !exist(uri)) return;

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

export function exist(uri?: vscode.Uri) {
  return URI.isUri(uri) && existsSync(uri.fsPath);
}

export function withProgress<T>(task: Promise<T>, title: string) {
  return new Promise<T>(resolve => {
    vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title }, async ({ report }) => {
      const result = await task;

      resolve(result);
    });
  });
}
