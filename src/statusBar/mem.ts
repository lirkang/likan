import * as vscode from 'vscode'
import * as os from 'os'
import formatSize from '../utils/formatSize'
import create from './create'

const mem = create(
  'likan-mem',
  undefined,
  `$(pulse)  ${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)} %`,
  `内存占用 ${formatSize(os.totalmem() - os.freemem())} / ${formatSize(
    os.totalmem()
  )}`,
  'right',
  101
)

export default mem
