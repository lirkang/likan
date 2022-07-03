/**
 * @Author likan
 * @Date 2022-06-11 13:35:57
 * @FilePath D:\CodeSpace\Dev\extension\likan\src\statusBar\slider.ts
 */

import create from './create'

const slider = create(
  'likan-slider',
  'workbench.action.toggleAuxiliaryBar',
  '$(layout-sidebar-left)',
  '切换侧边栏',
  'left',
  101
)

export default slider
