/**
 * @Author likan
 * @Date 2022-08-07 20:07:23
 * @Filepath src/common/index.ts
 */

import './context';

import { changeConfig, changeEditor, changeTextEditor } from './listeners';
import { fileSize, memory } from './statusbar';
export * from './listeners';
export * from './providers';
export { default as providers } from './providers';
export * from './statusbar';

export const listeners = [changeConfig, changeEditor, changeTextEditor];
export const statusbar = [fileSize, memory] as const;
