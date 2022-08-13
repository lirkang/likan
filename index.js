/**
 * @Author likan
 * @Date 2022/8/13 22:55:53
 * @FilePath D:\CodeSpace\Dev\likan\src\index.js
 */

const { resolve } = require('path');
const { readFileSync, readdirSync } = require('fs');

console.log(readdirSync(resolve('./')));
