# cra-template-pdf-vite-react

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
# suffix 代理标识

# 静态 index.html 代理
# root 目录
location ^~/root_suffix {
  alias /path;
}

# api 接口代理
location ^~/suffix/ {

}

# vite.config.ts
export default defineConfig({
- base: "/api/micro-app/portal/",
+ base: "/micro-web/suffix/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

Cloning this repo pulls down the Redux template only; not a bundled and configured Create React App.

For more information, please refer to:

- [Getting Started](https://create-react-app.dev/docs/getting-started) – How to create a new app.
- [User Guide](https://create-react-app.dev) – How to develop apps bootstrapped with Create React App.
