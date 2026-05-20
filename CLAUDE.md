# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

基于 Electron + React + Vite 的番茄时钟桌面应用，支持 Windows/macOS/Linux。

## 常用命令

```bash
# 开发模式（同时启动 Vite 开发服务器和 Electron）
npm run dev

# 打包发布（构建 Vite 产物 + electron-builder 打包）
npm run build

# 仅预览 Vite 构建产物（无 Electron）
npm run preview
```

开发模式下 Electron 自动打开 DevTools（detach 模式）。生产包输出到 `dist-electron/`。

## 架构概览

### 进程模型

- **主进程** (`electron/main.js`)：创建无边框窗口（`frame: false`）、系统托盘，处理 IPC 消息（托盘标题更新、系统通知、窗口最小化/隐藏）。关闭窗口时隐藏到托盘而非退出。
- **预加载脚本** (`electron/preload.js`)：通过 `contextBridge` 向渲染进程暴露 `window.electronAPI`，包含 `updateTray`、`notify`、`minimizeWindow`、`closeWindow`、`getUserDataPath`。
- **渲染进程** (`src/`)：标准 React SPA，通过 `window.electronAPI` 调用主进程功能（调用前需判断 `window.electronAPI` 是否存在，以兼容纯浏览器环境）。

### 状态管理

无第三方状态库，全部使用自定义 hooks（`src/store/useStore.js`）：

- `useSettings()`：设置项，持久化到 `localStorage('pomodoro_settings')`
- `useStats()`：每日番茄数统计，持久化到 `localStorage('pomodoro_stats')`，格式为 `{ history: { 'YYYY-MM-DD': count } }`
- `useTasks()`：任务列表，持久化到 `localStorage('pomodoro_tasks')`，任务结构为 `{ id, name, estimated, actual, done }`

### 计时器逻辑

`src/hooks/useTimer.js` 管理完整的番茄钟状态机：WORK → SHORT_BREAK / LONG_BREAK → WORK，每 `sessionsUntilLong`（默认 4）个番茄后触发长休息。计时器使用 `setInterval` + `useRef` 避免闭包陷阱，session 结束时通过回调通知 App 层（播放音效、发送通知、记录统计）。

### 音效

`src/hooks/useSound.js` 用 Web Audio API 合成提示音，无需外部音频文件。工作结束播放三声递升音，休息结束播放三声递降音。

### UI 结构

- `App.jsx`：根组件，管理底部四标签页导航（计时/任务/统计/设置），向各页面传入所需 state 和回调
- `TitleBar.jsx`：自定义标题栏，含最小化/关闭按钮（调用 `window.electronAPI`）
- `TimerRing.jsx`：SVG 环形进度条
- 主题通过 CSS 类名切换（`dark` / `light`），定义在 `src/styles.css`
