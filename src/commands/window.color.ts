/**
 * @Author likan
 * @Date 2022/8/23 21:57:35
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\window.color.ts
 */

import { names, TinyColor } from '@ctrl/tinycolor';

export default function windowColor() {
  const colors = [
    '#0e0e6bff',
    '#232596ff',
    '#606901ff',
    '#085f99ff',
    '#1f7505ff',
    '#182ebaff',
    '#4f62f0ff',
    '#c5e079ff',
    '#c90e66ff',
    '#552bb5ff',
    '#126d80ff',
    '#7a69d1ff',
    '#1a368aff',
    '#500373ff',
    '#8b36b3ff',
    '#c2007eff',
    '#2d888aff',
    '#471185ff',
    '#03857aff',
    '#3b4e9cff',
    '#713fccff',
    '#d42ad1ff',
    '#780cf2ff',
    '#057a22ff',
    '#4c32cfff',
    '#fa169fff',
    '#893dd1ff',
    '#7ebccfff',
    '#49c9a9ff',
    '#8e48c7ff',
    '#24a80fff',
    '#454fd9ff',
    '#1b32b5ff',
    '#eb177eff',
    '#8736ebff',
    '#2a55a1ff',
    '#599608ff',
    '#52d9b0ff',
    '#eb2513ff',
    '#b01a5bff',
    ...Object.values(names),
  ];

  const colorer = new TinyColor(colors[Math.floor(Math.random() * colors.length)]);
  const isDark = colorer.isDark();

  function handleColor(tint = 0, darken = 0) {
    if (isDark) {
      return colorer.tint(tint).toHex8String();
    } else {
      return colorer.darken(darken).toHex8String();
    }
  }

  vscode.workspace.getConfiguration().update(
    'workbench.colorCustomizations',
    {
      'activityBar.activeBackground': handleColor(20, 10),
      'activityBar.activeBorder': handleColor(20, 10),
      'activityBar.background': handleColor(20, 10),
      'activityBar.foreground': handleColor(80, 50),
      'activityBar.inactiveForeground': handleColor(50, 30),
      'activityBarBadge.background': handleColor(),
      'activityBarBadge.foreground': handleColor(70, 50),
      'sash.hoverBorder': handleColor(60, 20),
      'statusBar.background': handleColor(30, 20),
      'statusBar.foreground': handleColor(80, 50),
      'statusBarItem.hoverBackground': handleColor(30, 20),
      'statusBarItem.remoteBackground': handleColor(30, 20),
      'statusBarItem.remoteForeground': handleColor(80, 50),
      'titleBar.activeBackground': handleColor(0, 0),
      'titleBar.activeForeground': handleColor(70, 50),
      'titleBar.inactiveBackground': handleColor(30, 0),
      'titleBar.inactiveForeground': handleColor(50, 30),
      'tab.activeBorder': handleColor(40),
      'commandCenter.border': handleColor(60, 50),
    },
    vscode.ConfigurationTarget.Workspace
  );
}
