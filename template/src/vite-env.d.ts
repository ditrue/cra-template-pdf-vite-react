/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 定义所有你期望的环境变量
  readonly VITE_API_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
