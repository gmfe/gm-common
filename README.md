# gm-common 工具库

## 环境准备

- Install `node_modules`:]

  ```bash
  yarn
  ```

- 各个包的依赖安装

  ```bash
  lerna bootstrap
  ```

## 启动项目

```bash
yarn start
```

## 工具库文档使用 Storybook

项目启动后 访问 http://localhost:7001

我们可以在每个文件夹下面的 stories.tsx 编写示例代码

**### 一些主要的 packages**

@gm-common/analyse

@gm-common/date 处理日期相关的工具函数

@gm-common/fingerprint 通过 js 获取浏览器指纹 涉及依赖库：fingerprintjs2

@gm-common/google-map 谷歌地图相关

@gm-common/graph 工艺流程图（图标类，具体见文档）

@gm-common/hooks 封装好的自定义 hook

@gm-common/image 处理图片相关

@gm-common/locales 处理多语相关

@gm-common/map 地图组件 详细见 map 下 README.md

@gm-common/mobx mobx 相关

@gm-common/number 处理 number 相关 工具函数

@gm-common/request axios 封装的请求数据相关

@gm-common/router 前端路由相关

@gm-common/tool 各类工具函数

@gm-common/wx-sdk 微信 SDK https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#3

## 版本相关

#### 版本规则

所有的版本都有 3 个数字：x.y.z。

- 第一个数字是主版本。
- 第二个数字是次版本。
- 第三个数字是补丁版本。

当发布新的版本时，不仅仅是随心所欲地增加数字，还要遵循以下规则：

- 当进行不兼容的 API 更改时，则升级主版本。
- 当以向后兼容的方式添加功能时，则升级次版本。
- 当进行向后兼容的缺陷修复时，则升级补丁版本。

该约定在所有编程语言中均被采用，每个 npm 软件包都必须遵守该约定，这一点非常重要，因为整个系统都依赖于此。

#### 版本发布

一般版本发布分为如下几个版：

- 内测版本(alpha)
- 公测版本(beta)
- 正式版本

发布正式版本

```bash
yarn publish-latest
```

发布 beta 版本

```bash
yarn publish-latest-beta
```

#### CHANGELOG

见[CHANGELOG](./CHANGELOG.md)