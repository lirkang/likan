/**
 * @Author likan
 * @Date 2022-10-10 20:17:09
 * @Filepath likan/src/classes/Configuration.ts
 * @Description
 */

import { DEFAULT_CONFIGS } from '@/common/constants';
import { getConfig, getKeys } from '@/common/utils';

// @ts-ignore
const Configuration: Config = {};

getKeys(DEFAULT_CONFIGS).map(key => Object.defineProperty(Configuration, key, { get: () => getConfig(key) }));

export default Configuration;
