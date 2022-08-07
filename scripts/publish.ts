import { execSync } from 'child_process'
import { existsSync, readdirSync, readFileSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const rootPath = resolve('./')

console.log(resolve(rootPath, 'package.json'))

const packageJSON = JSON.parse(readFileSync(resolve(rootPath, 'package.json')).toString())

let version = (packageJSON['version'] as string).split('.').map(Number)

version[version.length - 1] += 1

console.log('新的版本为', version.join('.'))

writeFileSync(
  resolve(rootPath, 'package.json'),
  JSON.stringify({ ...packageJSON, version: version.join('.') }, undefined, 2)
)

console.log('正在发布中')

execSync('vsce publish')

console.log('发布成功')

console.log('正在删除打包的文件')

delDir(resolve(rootPath, 'lib'))

console.log('删除成功')

function delDir(path: string) {
  let files = []

  if (existsSync(path)) {
    files = readdirSync(path)
    files.forEach(file => {
      let curPath = path + '/' + file
      if (statSync(curPath).isDirectory()) {
        delDir(curPath)
      } else {
        unlinkSync(curPath)
      }
    })
    rmdirSync(path)
  }
}

execSync('git add .')
execSync(`git commit -m ${process.argv[3] ?? process.argv[2]}`)
