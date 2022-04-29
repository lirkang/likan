import * as vscode from 'vscode'

const comment = vscode.commands.registerCommand('likan.comment', async () => {
  vscode.window.activeTextEditor?.insertSnippet(
    new vscode.SnippetString(
      `/**
 * $1
 * @Author likan
 * @Date $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE $CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND 
 * @FileName $TM_FILENAME
 * @Software Visual Studio Code
 */\n`
    ),
    new vscode.Position(0, 0)
  )
})

export default comment
