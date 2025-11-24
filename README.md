# 🐑 羊了个羊 (Sheep Match) - AI 增强版

> 一款基于 React + Tailwind CSS 开发的超高难度消除游戏，集成 Google Gemini AI 进行实时“嘲讽”或鼓励。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5-orange)

## 🎮 游戏介绍

这就那款只有 0.1% 的人能通关的游戏！规则简单，但极具挑战性。

### 核心玩法

1. **消除机制**：点击上方的卡片，卡片会落入底部的槽位中。槽位中每凑齐 **3 张相同** 的卡片即可消除。
2. **失败条件**：底部槽位共有 7 个格子。如果槽位被填满且无法消除，游戏结束。
3. **层级遮挡**：卡片是层层堆叠的，你必须消除上层的卡片才能点击下层的卡片。
4. **道具辅助**：
   * **撤销**：将槽位中最后一张卡片移回牌堆（每局可用）。
   * **洗牌**：打乱场上剩余卡片的顺序（每局可用）。

### ✨ 特色功能

* **AI 智能评论**：游戏胜利或失败时，Google Gemini AI 会根据你的步数和结果生成独特的中文评价（嘲讽或夸赞）。
* **多难度选择**：
  * **简单模式**：平铺布局，适合新手热身。
  * **地狱模式**：经典的堆叠布局，极其考验策略和运气。
* **流畅动画**：卡片消除、入槽、胜利界面均包含细腻的动画效果。
* **响应式设计**：完美适配移动端和桌面端。

---

## 🛠️ 技术栈

* **前端框架**: React 19, TypeScript
* **样式库**: Tailwind CSS (通过 CDN 或构建引入)
* **AI 集成**: Google GenAI SDK (Gemini 2.5 Flash)
* **构建工具**: Vite
* **部署**: GitHub Actions & GitHub Pages

---

## 🚀 本地开发

按照以下步骤在本地运行项目：

1. **克隆仓库**

   ```bash
   git clone https://github.com/your-username/sheep-match.git
   cd sheep-match
   ```
2. **安装依赖**

   ```bash
   npm install
   ```
3. **配置环境变量**
   在根目录创建或设置环境变量（用于 AI 功能）：

   ```bash
   # Linux/Mac
   export API_KEY="your_google_gemini_api_key"

   # Windows (PowerShell)
   $env:API_KEY="your_google_gemini_api_key"
   ```
4. **启动开发服务器**

   ```bash
   npm run dev
   ```

---

## 📦 自动部署 (GitHub Pages)

本项目已配置 GitHub Actions，支持自动构建并部署到 GitHub Pages。

### 部署步骤

1. **启用 GitHub Pages**:

   * 进入仓库 **Settings** -> **Pages**。
   * 在 "Build and deployment" 下的 Source 选择 **GitHub Actions**。
2. **配置 API Key (可选)**:

   * 为了在部署后的版本中使用 AI 功能，你需要配置密钥。
   * 进入仓库 **Settings** -> **Secrets and variables** -> **Actions**。
   * 点击 **New repository secret**。
   * Name: `API_KEY`
   * Value: 你的 Google Gemini API Key。
3. **触发部署**:

   * 任何推送到 `main` 分支的代码提交都会自动触发部署流程。
   * 你可以在仓库的 **Actions** 标签页查看部署进度。

---

## 📄 许可证

MIT License

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1_t8O68VtBAT7WKGYrQsBtqnMhLJaU7XT

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
