import * as os from 'os'
import formatSize from '../utils/formatSize'
import create from './create'

const mem = create(
  'likan-mem',
  undefined,
  '$(plug)',
  `${formatSize(os.totalmem() - os.freemem())} / ${formatSize(os.totalmem())}`,
  'right',
  102
)

export default mem
