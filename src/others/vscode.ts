/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { DEFAULT_EXT } from '@/constants';
import { getDocComment } from '@/utils';

vscode.workspace.onDidCreateFiles(({ files }) => {
  files.forEach(uri => {
    const suffix = path.extname(uri.fsPath);

    if (DEFAULT_EXT.includes(suffix) && !fs.readFileSync(uri.fsPath, 'utf-8').toString().length) {
      fs.writeFileSync(uri.fsPath, getDocComment(uri));
    }
  });
});
