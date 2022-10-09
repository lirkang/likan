/**
 * @Author likan
 * @Date 2022-08-07 20:07:23
 * @Filepath likan/src/common/index.ts
 */

export * from './listeners';
export * from './providers';
export * from './statusbar';

import commands from '@/commands';

import * as listeners from './listeners';
import * as providers from './providers';
import * as statusbar from './statusbar';

const features = { commands, listeners, providers, statusbar };

export default features;
