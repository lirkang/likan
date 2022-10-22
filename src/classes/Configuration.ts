/**
 * @Author likan
 * @Date 2022-10-10 20:17:09
 * @Filepath likan/src/classes/Configuration.ts
 * @Description
 */

import { DEFAULT_CONFIGS } from '@/common/constants';

export const getConfig: getConfig = <K extends keyof Config>(key?: K | vscode.Uri, scope?: vscode.Uri) => {
  const uri = scope ?? (key instanceof vscode.Uri ? key : undefined);
  const configuration = vscode.workspace.getConfiguration('likan', uri);

  // @ts-ignore
  const unFormatConfigs = Object.keys(DEFAULT_CONFIGS).map(k => [ k, configuration.get(...DEFAULT_CONFIGS[k]) ]);
  const configs: Config = Object.fromEntries(unFormatConfigs);

  return typeof key === 'string' ? configs[key] : configs;
};

// @ts-ignore
const Configuration: Config = {};

(<Array<keyof Config>>Object.keys(DEFAULT_CONFIGS)).map(key => Object.defineProperty(Configuration, key, {
  get: () => getConfig(key),
}));

export default Configuration;
