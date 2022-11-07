/**
 * @Author likan
 * @Date 2022-10-10 20:17:09
 * @Filepath likan/src/classes/Configuration.ts
 * @Description
 */

import { CONFIG } from '@/common/constants';

// @ts-ignore
const Configuration: Writeable<{ [K in ConfigKey]: Any }> = {};

(<Array<ConfigKey>>Object.keys(CONFIG)).map(key => Object.defineProperty(Configuration, key, {
  get () {
    const workspaceConfiguration = vscode.workspace.getConfiguration();

    return workspaceConfiguration.get(CONFIG[key]);
  },
  set (value) {
    const workspaceConfiguration = vscode.workspace.getConfiguration();

    workspaceConfiguration.update(CONFIG[key], value);
  },
}));

export default Configuration;
