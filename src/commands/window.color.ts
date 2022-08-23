/**
 * @Author likan
 * @Date 2022/8/23 21:57:35
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\window.color.ts
 */

import { random } from '@ctrl/tinycolor';

export default function windowColor() {
  const colorer = random({});

  vscode.workspace.getConfiguration().update(
    'workbench.colorCustomizations',
    {
      'activityBar.activeBackground': '#' + colorer.tint(30).toHex(),
      'activityBar.activeBorder': '#' + colorer.toHex(),
      'activityBar.background': '#' + colorer.toHex(),
      'activityBar.foreground': '#' + colorer.toHex(),
      'activityBar.inactiveForeground': '#' + colorer.toHex(),
      'activityBarBadge.background': '#' + colorer.toHex(),
      'activityBarBadge.foreground': '#' + colorer.toHex(),
      'sash.hoverBorder': '#' + colorer.toHex(),
      'statusBar.background': '#' + colorer.toHex(),
      'statusBar.foreground': '#' + colorer.toHex(),
      'statusBarItem.hoverBackground': '#' + colorer.toHex(),
      'statusBarItem.remoteBackground': '#' + colorer.toHex(),
      'statusBarItem.remoteForeground': '#' + colorer.toHex(),
      'titleBar.activeBackground': '#' + colorer.toHex(),
      'titleBar.activeForeground': '#' + colorer.toHex(),
      'titleBar.inactiveBackground': '#' + colorer.toHex(),
      'titleBar.inactiveForeground': '#' + colorer.toHex(),
      'tab.activeBorder': '#' + colorer.toHex(),
      'commandCenter.border': '#' + colorer.toHex(),
    },
    vscode.ConfigurationTarget.Workspace
  );
}
