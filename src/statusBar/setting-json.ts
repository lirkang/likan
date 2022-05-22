import create from './create'

const settingJson = create(
  'likan-setting-json',
  'workbench.action.openSettingsJson',
  // '$(preferences-open-settings)',
  '设置',
  '打开设置JSON',
  'right',
  -11
)

export default settingJson
