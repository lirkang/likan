import * as vscode from 'vscode'

export class CodelensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = []
  private readonly regex: RegExp
  private readonly topKey: string
  private readonly getCommands: (
    key: string,
    value: string,
    index: number,
    uri: vscode.Uri
  ) => vscode.Command[]

  constructor(
    regex: CodelensProvider['regex'],
    topKey: CodelensProvider['topKey'],
    getCommands: CodelensProvider['getCommands']
  ) {
    this.regex = regex
    this.topKey = topKey
    this.getCommands = getCommands
  }

  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    this.codeLenses = []

    const regex = new RegExp(this.regex)

    const text = document.getText()

    let matches = regex.exec(text)

    if (!matches) return this.codeLenses

    const result = JSON.parse(`{${matches![0]}}`)[this.topKey]

    const line = document.lineAt(document.positionAt(matches!.index).line)

    Object.keys(result).forEach((key, index) => {
      const commands = this.getCommands(key, result[key], index, document.uri)

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
