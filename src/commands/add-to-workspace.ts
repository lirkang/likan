/**
 * @Author
 * @Date 2022/09/13 12:25:06
 * @FilePath E:/TestSpace/extension/likan/src/commands/add-to-workspace.ts
 * @Description
 */

import { VOID } from '@/common/constants';

export default function addToWorkspace(uri: vscode.Uri) {
  vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length ?? 0, VOID, { uri });
}
