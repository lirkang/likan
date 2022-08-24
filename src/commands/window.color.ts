/**
 * @Author likan
 * @Date 2022/8/23 21:57:35
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\window.color.ts
 */

import { random } from '@ctrl/tinycolor';

export default function windowColor() {
  const colorer = random({});
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
      'activityBar.activeBackground': handleColor(20, 20),
      'activityBar.activeBorder': handleColor(20, 20),
      'activityBar.background': handleColor(20, 20),
      'activityBar.foreground': handleColor(70, 50),
      'activityBar.inactiveForeground': handleColor(50, 30),
      'activityBarBadge.background': handleColor(),
      'activityBarBadge.foreground': handleColor(70, 50),
      'sash.hoverBorder': handleColor(60, 20),
      'statusBar.background': handleColor(10, 10),
      'statusBar.foreground': handleColor(70, 50),
      'statusBarItem.hoverBackground': handleColor(30, 20),
      'statusBarItem.remoteBackground': handleColor(10, 10),
      'statusBarItem.remoteForeground': handleColor(70, 50),
      'titleBar.activeBackground': handleColor(10, 10),
      'titleBar.activeForeground': handleColor(70, 50),
      'titleBar.inactiveBackground': handleColor(20, 30),
      'titleBar.inactiveForeground': handleColor(60, 40),
      'tab.activeBorder': handleColor(40),
      'commandCenter.border': handleColor(60, 0),
    },
    vscode.ConfigurationTarget.Workspace
  );
}
