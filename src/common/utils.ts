/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @Filepath likan/src/common/utils.ts
 */

import { curryRight, unary, upperFirst } from 'lodash-es';
import { existsSync } from 'node:fs';
import { get } from 'node:https';
import { format } from 'node:util';
import normalizePath from 'normalize-path';
import { URI, Utils } from 'vscode-uri';

export function formatSize(size: number, containSuffix = true, fixedIndex = 2, mode: 'simple' | 'default' = 'default') {
  const [floatSize, suffix] = size < 1024 ** 2 ? [1, 'K'] : size < 1024 ** 3 ? [2, 'M'] : [3, 'G'];

  return format(
    '%s %s',
    (size / 1024 ** floatSize).toFixed(fixedIndex),
    containSuffix ? suffix + (mode === 'default' ? 'B' : '') : ''
  );
}

export function toNormalizePath(uri: vscode.Uri | string) {
  return upperFirst(normalizePath(uri instanceof vscode.Uri ? uri.fsPath : uri));
}

export async function getRootUri(
  uri = vscode.window.activeTextEditor?.document.uri,
  [currentCount, maxCount]: [number, number] = [0, 5]
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
    return;
  }
}

export async function addExtension(uri: vscode.Uri, additionalExtension: Array<string> = []) {
  if (exist(uri)) return uri;

  for (const extension of [...Configuration.exts, ...additionalExtension]) {
    const files = [`${uri.fsPath}${extension}`, `${uri.fsPath}/index${extension}`, `${uri.fsPath}/index.d${extension}`];

    for (const file of files) {
      const fileUri = vscode.Uri.file(file);

      if (exist(fileUri)) return fileUri;
    }
  }
}

export async function getTargetFilePath(uri: vscode.Uri, ...paths: Array<string>) {
  const fileUri = vscode.Uri.joinPath(uri, ...paths);

  if (!exist(fileUri)) return addExtension(fileUri);

  const { type } = await vscode.workspace.fs.stat(fileUri);

  return type === vscode.FileType.File ? fileUri : addExtension(fileUri);
}

export function getKeys<K extends keyof Any>(object: Record<K, Any>) {
  return (Object.keys(object) as Array<K>).sort();
}

export function exist(uri?: vscode.Uri) {
  return URI.isUri(uri) && existsSync(uri.fsPath);
}

export default function request<T>(options: RequestOptions) {
  return new Promise<T>((resolve, reject) => {
    const { params: parameters = {}, url = '', headers = {} } = options;

    if (!url) return reject();

    const splicing = `${url}?${Object.entries(parameters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;

    const chunks: Array<Any> = [];

    get(splicing, { headers, timeout: 20_000 }, client => {
      client
        .on('data', chunk => chunks.push(chunk))
        .on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks)));
          } catch {
            // @ts-ignore
            resolve(chunks.join(''));
          }
        });
    }).on('error', reject);
  });
}

export function addLeadingString(string: string | number, targetLength: number, fillString: string) {
  const restLength = targetLength - string.toString().length;

  return restLength <= 0 ? string : `${fillString.repeat(restLength)}${string}`;
}

export function formatDate(parameter: number | string = Date.now(), dateSeparator = '-', hourSeparator = ':') {
  const date = new Date(parameter);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const second = date.getSeconds();

  const curriedFormat = curryRight(addLeadingString)(2, '0');

  return [
    [year, month, day].map(unary(curriedFormat)).join(dateSeparator),
    [hour, minutes, second].map(unary(curriedFormat)).join(hourSeparator),
  ].join(' ');
}
