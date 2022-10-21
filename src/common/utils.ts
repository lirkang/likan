/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @Filepath likan/src/common/utils.ts
 */

import { findUp } from 'find-up';
import { isString, unary, upperFirst } from 'lodash-es';
import { existsSync } from 'node:fs';
import { get } from 'node:https';
import { format } from 'node:util';
import normalizePath from 'normalize-path';
import { URI } from 'vscode-uri';

export function formatSize (size: number, containSuffix = true, fixedIndex = 2, mode: 'simple' | 'default' = 'default') {
  const [ floatSize, suffix ] = size < 1024 ** 2 ? [ 1, 'K' ] : size < 1024 ** 3 ? [ 2, 'M' ] : [ 3, 'G' ];

  return format(
    '%s %s',
    (size / 1024 ** floatSize).toFixed(fixedIndex),
    containSuffix ? suffix + (mode === 'default' ? 'B' : '') : '',
  );
}

export function toNormalizePath (uri: vscode.Uri | string) {
  return upperFirst(normalizePath(uri instanceof vscode.Uri ? uri.fsPath : uri));
}

export async function getRootUri (uri = vscode.window.activeTextEditor?.document.uri) {
  if (!uri) return;

  const result = await findUp('package.json', { allowSymlinks: false, cwd: uri.fsPath, type: 'file' });

  if (isString(result)) return vscode.Uri.file(result);
}

export function addExtension (uri: vscode.Uri, additionalExtension: Array<string> = []) {
  if (exists(uri)) return uri;

  for (const extension of [ ...Configuration.exts, ...additionalExtension ]) {
    const files = [ `${uri.fsPath}${extension}`, `${uri.fsPath}/index${extension}`, `${uri.fsPath}/index.d${extension}` ];

    for (const file of files) {
      const fileUri = vscode.Uri.file(file);

      if (exists(fileUri)) return fileUri;
    }
  }
}

export async function getTargetFilePath (uri: vscode.Uri, ...paths: Array<string>) {
  const fileUri = vscode.Uri.joinPath(uri, ...paths);

  if (!exists(fileUri)) return addExtension(fileUri);

  const { type } = await vscode.workspace.fs.stat(fileUri);

  return type === vscode.FileType.File ? fileUri : addExtension(fileUri);
}

export function getKeys<K extends keyof Any> (object: Record<K, Any>) {
  return (Object.keys(object) as Array<K>).sort();
}

export function exists (uri: vscode.Uri | Array<vscode.Uri> | undefined): boolean {
  return Array.isArray(uri) ? uri.every(unary(exists)) : URI.isUri(uri) && existsSync(uri.fsPath);
}

export default function request<T> (options: RequestOptions) {
  return new Promise<T>((resolve, reject) => {
    const { params: parameters = {}, url = '', headers = {} } = options;

    if (!url) return reject();

    const splicing = `${url}?${Object.entries(parameters)
      .map(([ key, value ]) => `${key}=${value}`)
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
