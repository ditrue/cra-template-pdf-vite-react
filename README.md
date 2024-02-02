# cra-template-qjp-typescript

The qjp-typescript template for [Create React App](https://github.com/facebook/create-react-app)

[![NPM](https://img.shields.io/npm/l/cra-template-qjp-typescript)](https://opensource.org/licenses/MIT)
[![OSCS Status](https://www.oscs1024.com/platform/badge/qjp88995/cra-template-qjp-typescript.svg?size=small)](https://www.oscs1024.com/project/qjp88995/cra-template-qjp-typescript?ref=badge_small)
[![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/qjp88995/cra-template-qjp-typescript)](https://github.com/ditrue/cra-template-pdf-vite-react)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/qjp88995/cra-template-qjp-typescript)](https://github.com/ditrue/cra-template-pdf-vite-react)
[![GitHub Repo stars](https://img.shields.io/github/stars/qjp88995/cra-template-qjp-typescript?style=social)](https://github.com/ditrue/cra-template-pdf-vite-react)
[![npm](https://img.shields.io/npm/dm/cra-template-qjp-typescript)](https://www.npmjs.com/package/cra-template-pdf-vite-react)

## Usage

To use this template within your project, add `--template cra-template-pdf-vite-react` when creating a new app.

For example:

```sh
npx create-react-app my-app --template cra-template-pdf-vite-react

# or

yarn create react-app my-app --template cra-template-pdf-vite-react
```

Nginx 代理

```sh
# 静态 index.html 代理
# root 目录
# suffix 代理标识
location ^~/root_suffix {
  alias /path;
}

# api 接口代理
location ^~/suffix/ {

}
```

Cloning this repo pulls down the Redux template only; not a bundled and configured Create React App.

For more information, please refer to:

- [Getting Started](https://create-react-app.dev/docs/getting-started) – How to create a new app.
- [User Guide](https://create-react-app.dev) – How to develop apps bootstrapped with Create React App.
