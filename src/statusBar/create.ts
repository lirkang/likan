import * as vscode from 'vscode'

type StatusBarAlignment = 'left' | 'right'

const alignment: { [K in StatusBarAlignment]: vscode.StatusBarAlignment } = {
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
  const statusBarItem = vscode.window.createStatusBarItem(
    id,
    alignment[align],
    priority
  )

  statusBarItem.command = command
  statusBarItem.text = text
  statusBarItem.tooltip = tooltip
  // statusBarItem.backgroundColor = new vscode.ThemeColor(
  //   'statusBarItem.warningBackground'
  // )
  // statusBarItem.color = new vscode.ThemeColor('activityBarBadge.background')

  return statusBarItem
}

vscode.window.createStatusBarItem(0, 0)

export default create
