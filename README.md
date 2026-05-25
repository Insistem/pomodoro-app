# 番茄时钟

基于 Electron + React + Vite 的桌面番茄时钟应用，支持 Windows / macOS / Linux。

## 功能

- 专注 / 短休息 / 长休息三种模式，自动循环
- 环形进度条 + 系统托盘实时显示剩余时间
- 任务列表，自动追踪每个任务消耗的番茄数
- 近 7 天专注统计图表
- 声音提醒 + 系统通知
- 深色 / 浅色主题切换

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发模式（同时启动 Vite + Electron，自动热重载）
npm run dev
```

开发模式下会自动打开 DevTools（detach 模式）。

## 本地构建

```bash
# 构建当前平台的安装包
npm run build
```

产物输出到 `dist-electron/`：

| 平台 | 产物 |
|------|------|
| Windows | `dist-electron/*.exe`（NSIS 安装包） |
| macOS | `dist-electron/*.dmg` |
| Linux | `dist-electron/*.AppImage` |

> macOS 构建必须在 macOS 机器上执行，Windows 同理，不支持跨平台编译。

## 自动构建与发布（GitHub Actions）

### 触发方式

推送符合 `v*.*.*` 格式的 git tag 即可触发自动构建：

```bash
git tag v1.2.0
git push origin v1.2.0
```

### 构建流程

```
推送 tag
    │
    ▼
GitHub Actions 触发
    │
    ├─── windows-latest ──→ npm run build ──→ .exe
    │
    └─── macos-latest ────→ npm run build ──→ .dmg
                │
                ▼
        自动创建 GitHub Release
        上传安装包到 Release 附件
```

Windows 和 macOS 两个构建任务**并行执行**，总耗时约 10～15 分钟。

### 查看构建状态

- 构建进度：`https://github.com/<用户名>/pomodoro-app/actions`
- 发布产物：`https://github.com/<用户名>/pomodoro-app/releases`

### Workflow 配置文件

`.github/workflows/build.yml`，关键配置说明：

```yaml
on:
  push:
    tags:
      - 'v*.*.*'          # 只在推 tag 时触发，避免每次提交都构建

permissions:
  contents: write         # 允许 Actions 创建 Release 和上传文件

jobs:
  build-windows:
    runs-on: windows-latest

  build-macos:
    runs-on: macos-latest
    env:
      CSC_IDENTITY_AUTO_DISCOVERY: false   # 跳过 macOS 代码签名
```

### macOS 安装包说明

当前构建**未进行代码签名**，用户首次打开时 macOS 会提示"无法验证开发者"。

解决方法：右键点击 `.dmg` 文件 → 选择**打开** → 在弹窗中再次点击**打开**。

如需正式签名分发，需要 Apple 开发者账号（$99/年），将证书存入 GitHub Secrets 后在 workflow 中配置 `CSC_LINK` 和 `CSC_KEY_PASSWORD`。

### 版本号规范

建议遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

| 类型 | 示例 | 说明 |
|------|------|------|
| 修复 bug | `v1.0.1` | 末位 +1 |
| 新增功能 | `v1.1.0` | 中位 +1，末位归零 |
| 破坏性变更 | `v2.0.0` | 首位 +1，其余归零 |

## 技术栈

| 模块 | 技术 |
|------|------|
| 桌面框架 | Electron 33 |
| 前端框架 | React 18 |
| 构建工具 | Vite 5 |
| 打包工具 | electron-builder |
| 图标库 | lucide-react |
| 音效 | Web Audio API（程序合成，无外部文件） |

## 项目结构

```
pomodoro-app/
├── electron/
│   ├── main.js          # 主进程：窗口、托盘、IPC
│   └── preload.js       # 预加载：暴露 electronAPI 给渲染进程
├── src/
│   ├── components/      # UI 组件
│   ├── hooks/           # useTimer、useSound
│   ├── store/           # useStore（localStorage 持久化）
│   ├── App.jsx          # 根组件，底部导航
│   └── styles.css       # 全局样式 + CSS 变量
├── .github/
│   └── workflows/
│       └── build.yml    # 自动构建 workflow
└── vite.config.js
```
