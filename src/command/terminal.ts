import { window } from 'vscode'

function terminal() {
  const { terminals } = window

  if (!terminals.length) window.createTerminal().show()
  else window.terminals[window.terminals.length - 1].show()

  window.activeTerminal?.hide()
}

export { terminal }
