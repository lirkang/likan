/**
 * @Author likan
 * @Date 2022-10-10 20:17:09
 * @Filepath likan/src/common/configuration.ts
 * @Description
 */

import { Config } from '@/common/constants';

// @ts-ignore
const Configuration: Mutable<{ [K in ConfigKey]: Any }> = {};

(<Array<ConfigKey>>Object.keys(Config)).map(key =>
  Object.defineProperty(Configuration, key, {
    get() {
      const workspaceConfiguration = vscode.workspace.getConfiguration();

      return workspaceConfiguration.get(Config[key]);
    },

    set(value) {
      const workspaceConfiguration = vscode.workspace.getConfiguration();

      workspaceConfiguration.update(Config[key], value);
    },
  })
);

export default Configuration;
