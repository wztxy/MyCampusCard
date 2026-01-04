<div align="center">

# MyCampusCard

**現代化校園卡流水分析工具**

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md)

[![License](https://img.shields.io/github/license/wztxy/MyCampusCard?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/wztxy/MyCampusCard?style=flat-square)](package.json)
[![Platform](https://img.shields.io/badge/平台-Windows%20%7C%20macOS-blue?style=flat-square)](#安裝)
[![Electron](https://img.shields.io/badge/Electron-39-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)

</div>

---

## 專案簡介

**MyCampusCard** 是一款現代化、跨平台的校園卡流水分析桌面應用。基於 Electron 和 Vue 3 建構，提供直觀的資料視覺化和全面的消費分析功能，同時確保您的資料安全與隱私。

## 功能特性

| 功能 | 描述 |
|------|------|
| **SSO 登入** | 透過學校統一身份認證系統安全登入 |
| **資料視覺化** | 基於 Chart.js 的互動式圖表，直觀展示消費分析 |
| **一鍵匯出** | 產生圖片報告或匯出原始流水 JSON |
| **隱私安全** | 所有憑證和資料僅在本機處理，不上傳至第三方伺服器 |
| **跨平台支援** | 原生支援 Windows 和 macOS |
| **多語言支援** | 支援繁體中文和英文 |

## 效果預覽

<div align="center">
  <img src="assets/report-example-zh.png" alt="報告示例" width="600" />
</div>

## 安裝

從 [GitHub Releases](https://github.com/wztxy/MyCampusCard/releases) 下載已建構版本，即可直接執行——無需安裝 Node.js。

### Windows

**可攜式執行檔 (.exe)**

1. 從 Release 資產中下載 `MyCampusCard-x.y.z.exe`
2. 雙擊執行
3. 若出現 Windows SmartScreen 提示，點擊 **更多資訊** → **仍要執行**
4. 若防毒軟體誤報，請從隔離區還原並加入信任清單

### macOS

**DMG 或 ZIP 壓縮檔**

1. 下載 macOS 資產（`MyCampusCard-x.y.z-*.dmg` 或 `MyCampusCard-x.y.z-mac.zip`）
2. 將 `MyCampusCard.app` 拖入 `/Applications`
3. 開啟 `MyCampusCard`

<details>
<summary><strong>常見問題：顯示「無法打開」或「已損壞」</strong></summary>

由於應用未進行 Apple 簽名/公證，macOS 可能會阻擋。請選擇以下任一方式解決：

| 方式 | 步驟 |
|------|------|
| **A** | 右鍵 `MyCampusCard.app` → **打開** → **打開** |
| **B** | **系統設定** → **隱私權與安全性** → **仍要打開** |
| **C** | 終端機執行以下指令 |

```bash
sudo xattr -rd com.apple.quarantine /Applications/MyCampusCard.app
open /Applications/MyCampusCard.app
```

應用程式套件內也附帶了輔助腳本：

```
MyCampusCard.app/Contents/Resources/macos/unquarantine.command
```

</details>

## 開發指南

### 環境要求

- Node.js v18+
- npm 或 yarn

### 快速開始

```bash
git clone https://github.com/wztxy/MyCampusCard.git
cd MyCampusCard

npm install

npm start
```

### 可用指令

| 指令 | 描述 |
|------|------|
| `npm start` | 建構並啟動 Electron 應用 |
| `npm run build` | 建構 Vue 前端 |
| `npm run pack` | 打包應用以供發佈 |
| `npm run typecheck` | 執行 TypeScript 型別檢查 |

## 參與貢獻

歡迎貢獻程式碼！請隨時提交 Pull Request。

## 授權條款

本專案基於 [AGPL-3.0](LICENSE) 授權條款開源。

Copyright © 2026 [wztxy](https://github.com/wztxy)

---

<div align="center">

### 鯨語校園

<img src="assets/whaleu-campus-qr.jpg" alt="鯨語校園 WeChat 小程式" width="200" />

在校生開發和營運的校園論壇 / 樹洞

掃碼體驗微信小程式！

</div>
