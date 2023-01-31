/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @Filepath likan/src/common/utils.ts
 */

import { isUndefined, upperFirst } from 'lodash-es';
import { existsSync } from 'node:fs';
import { get } from 'node:https';
import { normalize } from 'node:path';
import { packageDirectorySync } from 'pkg-dir';
import { URI } from 'vscode-uri';

export function toNormalizePath (uri: vscode.Uri | string) {
  return upperFirst(normalize(uri instanceof vscode.Uri ? uri.fsPath : uri));
}

export function findRootUri (uri = vscode.window.activeTextEditor?.document.uri) {
  if (!uri) return;

  const result = packageDirectorySync({ cwd: uri.fsPath });

  if (!isUndefined(result)) return vscode.Uri.file(result);
}

export async function addExtension (uri: vscode.Uri, additionalExtension: Array<string> = []) {
  const uris: Array<vscode.Uri> = [];

  for await (const extension of [ ...Configuration.EXTS, ...additionalExtension ])
    for await (const filename of [ `${uri.fsPath}${extension}`, `${uri.fsPath}/index${extension}` ]) {
      const uri = vscode.Uri.file(filename);

      if (!exist(uri)) continue;

      const { type } = await vscode.workspace.fs.stat(uri);

      if (type !== vscode.FileType.File) continue;

      uris.push(uri);
    }

  return uris;
}

export async function findTargetFile (uri: vscode.Uri, ...paths: Array<string>) {
  const fileUri = vscode.Uri.joinPath(uri, ...paths);

  if (!exist(fileUri)) return addExtension(fileUri);

  const { type } = await vscode.workspace.fs.stat(fileUri);

  return type === vscode.FileType.File ? [ fileUri ] : addExtension(fileUri);
}

export function exist (uri: vscode.Uri): boolean {
  return URI.isUri(uri) && existsSync(uri.fsPath);
}

export function request<T extends Any = Any> (url: string, options: Record<PropertyKey, Any> = {}) {
  const _url = new URL(url);

  return new Promise<T>((resolve, reject) => {
    get({ ...options, host: _url.host, path: _url.pathname }, response => {
      const data: Array<Any> = [];
      let size = 0;

      response.on('data', chunk => {
        data.push(chunk);
        size += chunk.length;
      });

      response.on('end', () => {
        const responseData = Buffer.concat(data, size).toString();

        try {
          resolve(JSON.parse(responseData));
        } catch {
          // @ts-ignore
          resolve(responseData);
        }
      });

      response.on('error', error => {
        reject(error);
      });
    });
  });
}
