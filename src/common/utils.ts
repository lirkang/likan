/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @Filepath likan/src/common/utils.ts
 */

import { isUndefined, unary, upperFirst } from 'lodash-es';
import { existsSync } from 'node:fs';
import { get } from 'node:https';
import normalizePath from 'normalize-path';
import { packageDirectory } from 'pkg-dir';
import { URI } from 'vscode-uri';

export function toNormalizePath (uri: vscode.Uri | string) {
  return upperFirst(normalizePath(uri instanceof vscode.Uri ? uri.fsPath : uri));
}

export async function getRootUri (uri = vscode.window.activeTextEditor?.document.uri) {
  if (!uri) return;

  const result = await packageDirectory({ cwd: uri.fsPath });

  if (!isUndefined(result)) return vscode.Uri.file(result);
}

export async function addExtension (uri: vscode.Uri, additionalExtension: Array<string> = []) {
  const uris: Array<vscode.Uri> = [];

  for await (const extension of [ ...Configuration.exts, ...additionalExtension ])
    for await (const file of [ `${uri.fsPath}${extension}`, `${uri.fsPath}/index${extension}` ]) {
      const uri = vscode.Uri.file(file);

      if (!exists(uri)) continue;

      const { type } = await vscode.workspace.fs.stat(uri);

      if (type !== vscode.FileType.File) continue;

      uris.push(uri);
    }

  return uris;
}

export async function getTargetFilePath (uri: vscode.Uri, ...paths: Array<string>) {
  const fileUri = vscode.Uri.joinPath(uri, ...paths);

  if (!exists(fileUri)) return addExtension(fileUri);

  const { type } = await vscode.workspace.fs.stat(fileUri);

  return type === vscode.FileType.File ? [ fileUri ] : addExtension(fileUri);
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
