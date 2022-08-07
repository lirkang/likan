import * as vscode from 'vscode'

type StatusBarAlignment = 'left' | 'right'

const alignment: { [key in StatusBarAlignment]: vscode.StatusBarAlignment } = {
  left: vscode.StatusBarAlignment.Left,
  right: vscode.StatusBarAlignment.Right
}

function create(
  id: string,
  command: string | undefined,
  text: string,
  tooltip: string,
  align: StatusBarAlignment,
  priority = 0
) {
  const statusBarItem = vscode.window.createStatusBarItem(id, alignment[align], priority)

  statusBarItem.command = command
  statusBarItem.text = text
  statusBarItem.tooltip = tooltip

  return statusBarItem
}

vscode.window.createStatusBarItem(0, 0)

export default create
