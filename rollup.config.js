// @ts-check

/**
 * @Author
 * @Date 2022-09-15 16:01:14
 * @FilePath E:/TestSpace/extension/likan/rollup.config.js
 * @Description
 */

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { resolve } from 'path';
import { defineConfig } from 'rollup';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

const IS_PROD = process.env.NODE_ENV !== 'development';

const config = defineConfig({
  input: 'src/index.ts',
  output: [{ format: 'commonjs', file: 'lib/index.js', sourcemap: IS_PROD ? false : 'inline' }],
  external: ['vscode'],
  treeshake: IS_PROD ? 'smallest' : 'safest',
  watch: {
    buildDelay: 500,
    include: ['src/**'],
    exclude: ['node_modules/**', 'lib/**'],
  },
  plugins: [
    inject({ vscode: 'vscode' }),
    typescript({ sourceMap: !IS_PROD }),
    nodeResolve({ extensions: ['.js', '.ts'], mainFields: ['module', 'main'] }),
    json({ preferConst: IS_PROD }),
    commonjs({}),
    replace({ preventAssignment: true }),
    alias({ entries: [{ find: '@', replacement: resolve(__dirname, 'src') }] }),
  ],
});

if (process.env.NODE_ENV !== 'development') {
  config.plugins?.push(filesize({}));
}

if (process.env.NODE_ENV === 'test') {
  config.plugins?.push(
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'lib/index.html',
    })
  );
}

if (process.env.NODE_ENV === 'production') {
  config.plugins?.push(terser({ format: { comments: false }, compress: { drop_console: true }, mangle: true }));
}

export default config;
