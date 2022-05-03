import * as vscode from 'vscode'

export class CodelensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = []
  private readonly regex: RegExp
  private readonly topKey: string
  private readonly commands: (
    key: string,
    value: string,
    index: number,
    uri: vscode.Uri
  ) => vscode.Command[]

  constructor(
    regex: CodelensProvider['regex'],
    topKey: CodelensProvider['topKey'],
    commands: CodelensProvider['commands']
  ) {
    this.regex = regex
    this.topKey = topKey
    this.commands = commands
  }

  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    this.codeLenses = []

    const regex = new RegExp(this.regex)

    const text = document.getText()

    let matches = regex.exec(text)

    const result = JSON.parse(`{${matches![0]}}`)[this.topKey]

    const line = document.lineAt(document.positionAt(matches!.index).line)

    Object.keys(result).forEach((key, index) => {
      const commands = this.commands(key, result[key], index, document.uri)

      commands.forEach(command => {
        const position = new vscode.Position(line.lineNumber + index + 1, 0)

        const codeLens = new vscode.CodeLens(
          new vscode.Range(position, position),
          command
        )

        this.codeLenses.push(codeLens)
      })
    })

    return this.codeLenses
  }
}
