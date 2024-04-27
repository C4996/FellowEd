# FellowED 开发指南

> 结对编程好帮手

<p align="center">
<img src="https://raw.githubusercontent.com/SAWARATSUKI/ServiceLogos/main/VisualStudioCode/VisualStudioCode.png" width="500px">
</p>

## 环境配置

### Node.js

VS Code 最新版运行在 Chromium 120，Node.js 18 上。请确保你使用 Node.js 18~22 的版本。你可以使用 `nvm use 18` 切换 Node 版本。

我们的 TypeScript 设置为开发时使用 ESNext，编译到 ES2022，后者是 Node.js 16+ 支持的 JavaScript 语言标准。

### 包管理器

我们统一使用 [pnpm](https://pnpm.io/zh/) 进行包管理，`/pnpm-lock.yaml` 应该与 `/package.json` 的更改一同提交，而 npm 的 `package-lock.json` 不应被提交。

如果你已经安装有 npm，请使用以下命令来安装 pnpm。

```sh
npm i -g pnpm
```

### 依赖

初次 `git clone` 仓库，以及每次 `git pull` 之后，请务必注意使用 `pnpm i` 安装/更新依赖，否则可能会出现很多难以发现原因的报错。

## 调试

使用 <kbd>F5</kbd> 开始调试。

为了测试通信，推荐同时打开两个 VS Code 工作区。

## 仓库管理

我们以仓库的默认分支为开发分支。

### 贡献

#### 格式化

- 请尽量避免对已有代码 l的未大幅更改的部分进行重新格式化。

- [ ] 我们会在之后设置 lint 规范以及相应的 CI 检查。

#### 创建 PR

####  审阅

#### 合并

- 合并 PR 应优先使用 rebase；
- 若 commit 信息较乱，则最好使用 squash；
- 尽量避免使用 merge。
