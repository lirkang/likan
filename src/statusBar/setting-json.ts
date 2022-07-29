import create from './create'

const settingJson = create(
  'likan-setting-json',
  'workbench.action.openSettingsJson',
  '$(settings)',
  `Open settings.json`,
  'right',
  -11
)

export default settingJson
