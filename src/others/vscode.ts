/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT } from '@/constants';
import { getDocComment } from '@/utils';

vscode.workspace.onDidCreateFiles(({ files }) => {
  files.forEach(({ fsPath }) => {
    const suffix = path.extname(fsPath);

    if (DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT.includes(suffix) && !fs.readFileSync(fsPath, 'utf-8').toString().length) {
      fs.writeFileSync(fsPath, getDocComment(fsPath));
    }
  });
});
