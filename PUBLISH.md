# 发布指南

本文档说明如何将 `gm-common` 工具库发布到 npm registry。

## 📋 前置准备

### 1. 获取 NPM Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 进入 **Account Settings** → **Access Tokens**
3. 创建新的 **Automation** 或 **Publish** 类型的 token
4. 复制生成的 token（格式：`npm_xxxxxxxxxxxxx`）

### 2. 配置环境变量

**方式一：临时设置（当前终端会话有效）**

```bash
export NPM_TOKEN=npm_your_token_here
```

**方式二：永久设置（推荐）**

将 token 添加到 shell 配置文件中：

```bash
# 对于 zsh 用户
echo 'export NPM_TOKEN=npm_your_token_here' >> ~/.zshrc
source ~/.zshrc

# 对于 bash 用户
echo 'export NPM_TOKEN=npm_your_token_here' >> ~/.bashrc
source ~/.bashrc
```

**方式三：使用 .env 文件（不推荐提交到仓库）**

创建 `.env` 文件（已添加到 `.gitignore`）：

```bash
echo "NPM_TOKEN=npm_your_token_here" > .env
```

### 3. 配置代理（如果需要）

如果网络环境需要代理访问 npm registry：

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

## 🚀 发布命令

### 快速发布（推荐）

使用便捷脚本：

```bash
# 使用默认配置（需要先设置 NPM_TOKEN）
./scripts/publish.sh

# 或指定 token
NPM_TOKEN=your_token ./scripts/publish.sh
```

### 手动发布

#### 1. 发布正式版本（自动 patch）

自动递增 patch 版本号（如 `2.15.8` → `2.15.9`）：

```bash
npm run publish-latest-token
```

#### 2. 发布正式版本（交互式）

手动选择版本类型（patch/minor/major）：

```bash
npm run publish-latest
```

#### 3. 发布 Beta 版本

发布带 `beta` 标签的版本：

```bash
npm run publish-beta
```

## 📦 发布流程说明

### 使用 `publish-latest-token` 命令时：

1. **自动生成临时 `.npmrc`**：使用环境变量中的 `NPM_TOKEN` 生成认证文件
2. **版本号递增**：自动将当前版本号的 patch 部分 +1
3. **发布所有包**：使用 `--force-publish` 强制发布所有 17 个包
4. **Git 操作**：
   - 更新所有包的 `package.json` 版本号
   - 创建 git tag
   - 推送到远程仓库
5. **发布到 npm**：将所有包发布到 npm registry
6. **清理临时文件**：自动删除临时生成的 `.npmrc` 文件

### 发布的包列表

- @gm-common/analyse
- @gm-common/date
- @gm-common/fingerprint
- @gm-common/google-map
- @gm-common/graph
- @gm-common/hooks
- @gm-common/image
- @gm-common/locales
- @gm-common/map
- @gm-common/mobx
- @gm-common/number
- @gm-common/qiniup
- @gm-common/request
- @gm-common/router
- @gm-common/tool
- @gm-common/wx-sdk
- @gm-common/x-request

## 🔒 安全注意事项

1. **不要提交 token**：
   - `.npmrc` 文件已添加到 `.gitignore`
   - 不要将 token 硬编码到代码中
   - 使用环境变量管理 token

2. **Token 权限**：
   - 使用最小权限原则
   - 定期轮换 token
   - 如果 token 泄露，立即撤销并创建新 token

3. **CI/CD 环境**：
   - 在 CI/CD 系统中使用环境变量或密钥管理服务
   - 不要将 token 写入日志

## ❓ 常见问题

### Q: 发布失败，提示认证错误？

**A:** 检查以下几点：
1. `NPM_TOKEN` 环境变量是否已设置：`echo $NPM_TOKEN`
2. Token 是否有效：`npm whoami`（需要先设置 token）
3. Token 是否有发布权限

### Q: 如何查看当前版本？

**A:** 查看 `lerna.json` 文件中的 `version` 字段，或运行：
```bash
lerna ls
```

### Q: 如何只发布某个包？

**A:** 当前配置使用 `--force-publish` 发布所有包。如需单独发布，可以：
```bash
cd packages/your-package-name
npm publish
```

### Q: 发布后如何回滚？

**A:** npm 不允许删除已发布的版本，但可以：
1. 发布一个新的 patch 版本修复问题
2. 使用 `npm deprecate` 标记某个版本为废弃

## 📚 相关文档

- [npm 发布文档](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Lerna 发布文档](https://github.com/lerna/lerna/tree/main/commands/publish)
- [语义化版本规范](https://semver.org/lang/zh-CN/)

