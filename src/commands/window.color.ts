/**
 * @Author likan
 * @Date 2022/8/23 21:57:35
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\window.color.ts
 */

import { names, TinyColor } from '@ctrl/tinycolor';

import { colors } from '@/constants';

export default function windowColor() {
  const colorList = colors.concat(Object.values(names));

  const colorer = new TinyColor(colorList[Math.floor(Math.random() * colorList.length)]);
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
