# Likan

这是一个对 vscode 所缺少的功能补全的插件

### 功能

> **请注意**: 这一切都是可以配置的

- html/vue/jsx wrap: 选中文字创建一个父标签
- npm select: 多工作区检索 package.json 命令
- alias replace: css, png 等别名跳转
- js: 创建文件时自动生成文档注释
- html: 一键在浏览器打开

### 使用

- `ctrl+shift+p` 打开命令窗口输入 `likan`
- 使用快捷键

### 配置

- 查询跳转时自动检索后缀名

```json
{ "likan.language.exts": [".js", ".ts", ".jsx", ".tsx", "vue"] }
```

- 创建父标签时候选的标签列表

```json
{ "likan.language.htmlTag": ["div", "span", "template"] }
```

- 更多配置请查看功能列表

### 更新日志

[查看日志](CHANGELOG.md)

---
