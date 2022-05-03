import * as vscode from 'vscode'

function comment() {
  return vscode.window.activeTextEditor?.insertSnippet(
    new vscode.SnippetString(`/**
 * $1
 * @Author likan
 * @Date $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE $CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND 
 * @FileName $TM_FILENAME
 * @Software Visual Studio Code
 */\n\n`),
    new vscode.Position(0, 0)
  )
}

export { comment }
