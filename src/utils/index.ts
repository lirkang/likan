/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import { DEFAULT_CONFIGS, EMPTY_STRING, FALSE, PACKAGE_JSON, QUOTES, TRUE, UNDEFINED } from '@/constants';

/**
 * 格式化文件大小
 * @param size 文件大小
 * @param containSuffix 是否添加单位
 * @param fixedIndex 保留几位小数
 * @returns 文件大小
 */
function formatSize (size: number, containSuffix = TRUE, fixedIndex = 2) {
  const [floatSize, suffix] =
    size < 1024 ** 2 ? [size / 1024, 'K'] : size < 1024 ** 3 ? [size / 1024 ** 2, 'M'] : [size / 1024 ** 3, 'G'];

  return util.format('%s %s', floatSize.toFixed(fixedIndex), containSuffix ? suffix : EMPTY_STRING);
}

/**
 * 将字符串首字母转为大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
function toFirstUpper (str: string) {
  return str.replace(/./, m => m.toUpperCase());
}

/**
 * 获取工作区根目录(根据package.json判断)
 * @param filepath 文件路径
 * @returns 根目录
 */
function getRootPath (filepath = EMPTY_STRING, showError = FALSE): string | undefined {
  if (/^\w:\\$/.test(filepath)) return;

  let fsPath: string = filepath;

  if (filepath === EMPTY_STRING) {
    if (!vscode.window.activeTextEditor) return;

    fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;
  }

  if (!fsPath) return;

  try {
    if (fs.statSync(fsPath).isDirectory()) {
      return fs.existsSync(path.join(fsPath, PACKAGE_JSON)) ? fsPath : getRootPath(path.join(fsPath, '..'));
    } else {
      return fsPath.endsWith(PACKAGE_JSON) ? path.dirname(fsPath) : getRootPath(path.join(fsPath, '..'));
    }
  } catch {
    if (showError) vscode.window.showErrorMessage('没有获取到工作区, 请检查是否存在package.json');
  }
}

/**
 * 自动根据路径补全后缀查询
 * @param filepath 路径
 * @param additionalExt 额外的后缀
 * @returns 查找到的文件
 */
function addExt (filepath: string, additionalExt: Array<string> = []) {
  filepath = path.join(filepath);

  if (verifyExistAndNotDirectory(filepath)) return filepath;

  for (const e of getConfig('exts').concat(additionalExt)) {
    const files = [`${filepath}${e}`, `${filepath}/index${e}`];

    for (const f of files) {
      if (verifyExistAndNotDirectory(f)) return f;
    }
  }
}

interface getConfig {
  (): Config;
  <K extends keyof Config>(key: K): Config[K];
}

/**
 * 获取配置
 * @returns 配置
 */
const getConfig: getConfig = <K extends keyof Config>(key?: K) => {
  const configuration = vscode.workspace.getConfiguration('likan');

  // @ts-ignore
  const unFormatConfigs = Object.keys(DEFAULT_CONFIGS).map(k => [k, configuration.get(...DEFAULT_CONFIGS[k])]);

  const configs: Config = Object.fromEntries(unFormatConfigs);

  return key ? configs[key] : configs;
};

/**
 * 获取文档注释
 * @param fsPath 文件路径
 * @returns 文档注释
 */
function getDocComment (fsPath: string) {
  return `/**
 * @Author ${getConfig().author}
 * @Date ${new Date().toLocaleString()}
 * @FilePath ${toFirstUpper(fsPath)}
 */\n\n`;
}

interface thenableToPromise {
  <T>(fn: Thenable<T | undefined>): Promise<T>;
  <T extends Record<keyof Any, Any>, K extends keyof T>(fn: Thenable<T | undefined>, key: K): Promise<T[K]>;
}

/**
 * 将thenable转换为promise
 * @param fn thenable类型的执行函数
 * @param key 从结果中获取key值
 * @returns then返回结果, catch返回undefined
 */
const thenableToPromise: thenableToPromise = <T extends Record<keyof Any, Any>, K extends keyof T>(
  fn: Thenable<T | undefined>,
  key?: K
) => {
  return new Promise<T | T[K]>((rs, rj) => {
    fn.then(result => {
      if (result === UNDEFINED) {
        rj(result);
      } else {
        rs(key ? result[key] : result);
      }
    });
  });
};

function getTargetFilePath (...paths: Array<string>) {
  const filepath = path.join(...paths);

  if (fs.existsSync(filepath)) {
    if (fs.statSync(filepath).isDirectory()) {
      return addExt(filepath);
    } else {
      return filepath;
    }
  } else {
    return addExt(filepath);
  }
}

function verifyExistAndNotDirectory (filepath: string) {
  return fs.existsSync(filepath) && !fs.statSync(filepath).isDirectory();
}

function removeMatchedStringAtStartAndEnd (
  string: string,
  startArray: Array<string> = QUOTES,
  endArray: Array<string> = QUOTES
) {
  if (startArray.find(q => string.startsWith(q))) {
    string = string.slice(1);
  }

  if (endArray.find(q => string.endsWith(q))) {
    string = string.slice(0, string.length - 1);
  }

  return string;
}

function openFolder (fsPath: string, flag = TRUE) {
  if (!fsPath || !fs.existsSync(fsPath)) return;

  vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(fsPath), flag);
}

function formatDocument () {
  vscode.commands.executeCommand('editor.action.formatDocument');
}

export {
  addExt,
  formatDocument,
  formatSize,
  getConfig,
  getDocComment,
  getRootPath,
  getTargetFilePath,
  openFolder,
  removeMatchedStringAtStartAndEnd,
  thenableToPromise,
  toFirstUpper,
  verifyExistAndNotDirectory,
};
