/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @Filepath src/common/utils.ts
 */

import { upperFirst } from 'lodash-es';
import { existsSync } from 'node:fs';
import { get } from 'node:https';
import { format } from 'node:util';
import normalizePath from 'normalize-path';
import { URI, Utils } from 'vscode-uri';

import { Config, DEFAULT_CONFIGS } from './constants';

export function formatSize(size: number, containSuffix = true, fixedIndex = 2) {
  const [floatSize, suffix] = size < 1024 ** 2 ? [1, 'K'] : size < 1024 ** 3 ? [2, 'M'] : [3, 'G'];

  return format('%s %s', (size / 1024 ** floatSize).toFixed(fixedIndex), containSuffix ? suffix : '');
}

export function toNormalizePath(uri: vscode.Uri | string) {
  return upperFirst(normalizePath(uri instanceof vscode.Uri ? uri.fsPath : uri));
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
  const uri = scope ?? (key instanceof vscode.Uri ? key : undefined);

  const configuration = vscode.workspace.getConfiguration('likan', uri);

  // @ts-ignore
  const unFormatConfigs = getKeys(DEFAULT_CONFIGS).map(k => [k, configuration.get(...DEFAULT_CONFIGS[k])]);
  const configs: Config = Object.fromEntries(unFormatConfigs);

  return typeof key === 'string' ? configs[key] : configs;
};

export async function getTargetFilePath(uri: vscode.Uri, ...paths: Array<string>) {
  const fileUri = vscode.Uri.joinPath(uri, ...paths);

  if (!exist(fileUri)) return addExtension(fileUri);

  const { type } = await vscode.workspace.fs.stat(fileUri);

  return type === vscode.FileType.File ? fileUri : addExtension(fileUri);
}

export function openFolder(uri: vscode.Uri, flag: boolean) {
  if (!uri || !exist(uri)) return;

  vscode.commands.executeCommand('vscode.openFolder', uri, flag);
}

export function getKeys<K extends keyof Any>(object: Record<K, Any>) {
  return (Object.keys(object) as Array<K>).sort();
}

export function exist(uri?: vscode.Uri) {
  return URI.isUri(uri) && existsSync(uri.fsPath);
}

export default function request<T>(options: Options) {
  return new Promise<T>((resolve, reject) => {
    const { params: parameters = {}, url = '', headers = {} } = options;

    if (!url) return reject();

    const splicing = `${url}?${Object.entries(parameters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;

    const chunks: Array<Any> = [];

    get(splicing, { headers }, client => {
      client.on('data', chunks.push).on('end', () => {
        try {
          // @ts-ignore
          resolve(JSON.parse(Buffer.concat(chunks)));
        } catch {
          // @ts-ignore
          resolve(chunks.join(''));
        }
      });
    }).on('error', () => {
      return reject();
    });
  });
}
