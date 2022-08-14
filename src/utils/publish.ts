import { EMPTY_ARRAY } from '@/constants';
import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const rootPath = resolve('./');

console.log(resolve(rootPath, 'package.json'));

const packageJSON = JSON.parse(readFileSync(resolve(rootPath, 'package.json'), 'utf-8').toString());

let version = (packageJSON['version'] as string).split('.').map(Number);

if (version[2].toString().length === 1) {
  version[2] *= 10;
}

if (version[2] === 99) {
  version[1] += 1;
  version[2] = -1;
}

version[version.length - 1] += 1;

console.log('新的版本为', version.join('.'));

writeFileSync(
  resolve(rootPath, 'package.json'),
  JSON.stringify({ ...packageJSON, version: version.join('.') }, void 0, 2)
);

console.log('正在发布中');

execSync('vsce publish --no-yarn');

console.log('发布成功');

console.log('正在删除打包的文件');

delDir(resolve(rootPath, 'lib'));

console.log('删除成功');

execSync('git add .');
execSync(`git commit -m ${process.argv[3] ?? process.argv[2]}`);

function delDir(path: string) {
  let files: Array<string> = EMPTY_ARRAY;

  if (existsSync(path)) {
    files = readdirSync(path);
    files.forEach(file => {
      let curPath = path + '/' + file;
      if (statSync(curPath).isDirectory()) {
        delDir(curPath);
      } else {
        unlinkSync(curPath);
      }
    });

    rmdirSync(path);
  }
}
