# Likan

这是一个对 `vscode` 所缺少的功能补全的插件...

### 功能

`部分功能依赖于工作区的 package.json 文件, 请确保工作区中存在该文件`

功能列表

- `html/vue/jsx wrap`: 选中节点创建一个父标签
- `npm select`: 多工作区检索 package.json 命令
- `js/vue/package.json.deps jump to`: js/css/png 等别名和项目依赖跳转
- `js`: 创建文件时自动生成文档注释
- `html`: 在浏览器打开当前文件

### 配置

- 查询跳转时自动检索后缀名

```json
{ "likan.language.exts": [".js", ".ts", ".jsx", ".tsx", ".vue"] }
```

- 创建父标签时的候选标签列表

```json
{ "likan.language.htmlTag": ["div", "span", "template"] }
```

更多配置请查看功能贡献

### 更新日志

[查看日志](CHANGELOG.md)

---
