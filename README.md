# Cocos Store Build 📦🎮

推荐作为开发依赖安装：
```bash
npm i -D cocos-store-build
```

一个面向 **Cocos Creator 3.x** 的发布包构建 CLI，帮助你把项目中需要提交到 Cocos Store 的内容整理到独立目录中。✨

它会自动收集项目的核心文件，并支持通过配置文件添加额外资源，最终生成一个干净、可发布的 `build_store` 目录。🚀

## ✨ 特性

- 🎯 面向 Cocos Creator 3.x 项目
- 📁 默认收集 Cocos 项目的核心内容
- 🛠️ 支持通过 `cocos-build.json` 自定义额外文件或目录
- 🧹 输出到独立的 `build_store` 目录，不影响源项目
- 💬 使用彩色命令行提示和构建进度动画
- ⚡ 基于 Node.js 18+ 与 TypeScript 构建

## 📦 安装

### 从 npm 安装

```bash
npm install cocos-store-build
```

### 本地开发

```bash
npm install
```

构建项目：

```bash
npm run build
```

实时监听构建：

```bash
npm run dev
```

检查 TypeScript 类型：

```bash
npm run typecheck
```

## 🚀 快速开始

请在 Cocos Creator 项目根目录中执行命令。

### 1. 初始化配置文件

```bash
cocos-build -init
```

执行后会生成：

```text
cocos-build.json
```

默认内容如下：

```json
{
    "include": []
}
```

### 2. 构建 Store 发布包

```bash
cocos-build -b
```

构建完成后，项目根目录会生成：

```text
build_store/
```

### 3. 检查输出内容

确认 `build_store` 中包含需要发布的项目文件后，即可将该目录用于后续的 Cocos Store 发布流程。✅

## 🧰 CLI 命令

| 命令 | 说明 |
| --- | --- |
| `cocos-build -init` | 初始化 `cocos-build.json` 配置文件 |
| `cocos-build -c` | 查看默认包含的项目内容 |
| `cocos-build -b` | 构建 Cocos Store 发布包 |
| `cocos-build -v` | 查看当前 CLI 版本 |
| `cocos-build -h` | 查看帮助信息 |

## ⚙️ 配置文件

配置文件名称固定为：

```text
cocos-build.json
```

### 添加额外文件或目录

例如，需要额外包含 `README.md`、`LICENSE` 和 `native` 目录：

```json
{
    "include": [
        "README.md",
        "LICENSE",
        "native"
    ]
}
```

配置中的路径以 **Cocos 项目根目录** 为基准。📍

如果配置的文件或目录不存在，构建时会输出提示，但不会自动创建对应内容。⚠️

## 📋 默认包含内容

即使没有在 `include` 中配置，工具也会尝试包含以下项目内容：

```text
assets/
settings/
project.json
package.json
```

这些内容通常是 Cocos Creator 项目运行、识别和发布所需要的核心文件。🎨

## 📂 输出目录结构

一次典型构建后的目录结构如下：

```text
你的 Cocos 项目/
├─ assets/
├─ settings/
├─ project.json
├─ package.json
├─ cocos-build.json
└─ build_store/
   ├─ assets/
   ├─ settings/
   ├─ project.json
   └─ package.json
```

工具会尽量保留源文件的相对目录结构，方便检查和上传。📦

## 🛠️ 开发信息

项目使用以下技术：

- Node.js `>=18` 🟢
- TypeScript `5.x`
- tsup
- chalk
- ora

主要目录：

```text
src/
├─ cli.ts          # CLI 命令入口
├─ index.ts        # npm 包入口
└─ utils/
   ├─ File.ts      # 文件、目录和配置处理
   └─ Path.ts      # 路径与存在性检查
```

## 🔍 常见问题

### 找不到 `cocos-build.json`

请先在 Cocos 项目根目录执行：

```bash
cocos-build -init
```

然后再次构建：

```bash
cocos-build -b
```

### 已经存在配置文件

如果当前目录已经存在 `cocos-build.json`，初始化命令不会覆盖它，避免误删已有配置。🛡️

### 如何查看默认配置？

执行：

```bash
cocos-build -c
```

Made for Cocos Creator developers 💙🎮
