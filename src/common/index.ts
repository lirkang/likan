/**
 * @Author likan
 * @Date 2022-08-07 20:07:23
 * @FilePath D:\CodeSpace\Dev\likan\src\others\index.ts
 */

import { changeConfig, changeEditor, changeTextEditor, saveText } from './listeners';
import { fileSize, memory } from './statusbar';

export * from './context';
export * from './listeners';
export * from './providers';
export { default as providers } from './providers';
export * from './statusbar';

export const listeners = [changeConfig, changeEditor, saveText, changeTextEditor];
export const statusbar = [fileSize, memory] as const;
