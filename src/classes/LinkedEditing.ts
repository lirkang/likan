/**
 * @Author likan
 * @Date 2022-12-16 17:48:37
 * @Filepath likan/src/classes/LinkedEditing.ts
 */

class _LinkedEditing implements vscode.LinkedEditingRangeProvider {
  provideLinkedEditingRanges (
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ) {
    console.log('[LinkedEditing.ts: 13]', 123);

    return new vscode.LinkedEditingRanges([ new vscode.Range(0, 0, 0, 5), new vscode.Range(1, 0, 1, 5) ], /.*/);
  }
}

const linkedEditingProvider = new _LinkedEditing();

export default linkedEditingProvider;
