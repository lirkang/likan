/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import { DEFAULT_ALIAS_MAP, DEFAULT_EXT, DEFAULT_TAG, EMPTY_STRING, PACKAGE_JSON } from '@/constants';

/**
 * 格式化文件大小
 * @param size 文件大小
 * @param containSuffix 是否添加单位
 * @param fixedIndex 保留几位小数
 * @returns 文件大小
 */
function formatSize(size: number, containSuffix = true, fixedIndex = 2) {
  if (size < 1024 * 1024) {
    const temp = size / 1024;

    return temp.toFixed(fixedIndex) + (containSuffix ? ' K' : EMPTY_STRING);
  } else if (size < 1024 * 1024 * 1024) {
    const temp = size / (1024 * 1024);

    return temp.toFixed(fixedIndex) + (containSuffix ? ' M' : EMPTY_STRING);
  } else {
    const temp = size / (1024 * 1024 * 1024);

    return temp.toFixed(fixedIndex) + (containSuffix ? ' G' : EMPTY_STRING);
  }
}

/**
 * 将字符串首字母转为大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
function toFirstUpper(str: string) {
  return str.replace(/./, m => m.toUpperCase());
}

interface getRootPath {
  (asExist: true, showError: boolean): string;
  (filepath?: string, showError?: boolean): string | undefined;
}

/**
 * 获取工作区根目录(根据package.json判断)
 * @param filepath 文件路径
 * @returns 根目录
 */
const getRootPath: getRootPath = (filepath, showError = true) => {
  if (typeof filepath === 'string') {
    try {
      if (fs.statSync(filepath).isDirectory()) {
        return fs.existsSync(path.join(filepath, PACKAGE_JSON)) ? filepath : getRootPath(path.join(filepath, '..'));
      } else {
        return filepath.endsWith(PACKAGE_JSON) ? path.dirname(filepath) : getRootPath(path.join(filepath, '..'));
      }
    } catch {
      if (showError) vscode.window.showErrorMessage('没有获取到工作区, 请检查是否存在package.json');
    }
  } else if (typeof filepath === 'boolean') {
    return getRootPath(vscode.window.activeTextEditor!.document.uri.fsPath)!;
  } else if (filepath === void 0) {
    if (!vscode.window.activeTextEditor) return;

    const fsPath = vscode.window.activeTextEditor.document.uri.fsPath;

    return getRootPath(fsPath);
  }
};

/**
 * 自动根据路径补全后缀查询
 * @param filepath 路径
 * @param additionalExt 额外的后缀
 * @returns 查找到的文件
 */
function addExt(filepath: string, additionalExt: Array<string> = []) {
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
const getConfig: getConfig = <K extends keyof Config>(key?: K): Config | Config[K] => {
  const configuration = vscode.workspace.getConfiguration('likan');

  const config: Config = {
    author: configuration.get('language.author', 'likan'),
    manager: configuration.get('npm.manager', 'npm'),
    fileSize: configuration.get('statusbar.fileSize', true),
    memory: configuration.get('statusbar.memory', true),
    terminal: configuration.get('statusbar.terminal', true),
    htmlTag: configuration.get('language.htmlTag', DEFAULT_TAG),
    exts: configuration.get('language.exts', DEFAULT_EXT),
    alias: configuration.get('language.alias', DEFAULT_ALIAS_MAP),
  };

  return key ? config[key] : config;
};

/**
 * 获取文档注释
 * @param uri 文件路径
 * @returns 文档注释
 */
function getDocComment(uri: vscode.Uri) {
  return `/**
 * @Author ${getConfig().author}
 * @Date ${new Date().toLocaleString()}
 * @FilePath ${toFirstUpper(uri.fsPath)}
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
      if (result === void 0) {
        rj(result);
      } else {
        rs(key ? result[key] : result);
      }
    });
  });
};

function getTargetFilePath(...paths: Array<string>) {
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

function verifyExistAndNotDirectory(filepath: string) {
  return fs.existsSync(filepath) && !fs.statSync(filepath).isDirectory();
}

export {
  addExt,
  formatSize,
  getConfig,
  getDocComment,
  getRootPath,
  getTargetFilePath,
  thenableToPromise,
  toFirstUpper,
  verifyExistAndNotDirectory,
};
