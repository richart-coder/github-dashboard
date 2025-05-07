---
title: GitHub Dashboard 開發紀錄
marp: true
---

# GitHub Dashboard

個人化 GitHub 通知面板

---

## 目錄

- [專案架構](#專案架構)
- [技術棧](#技術棧)
- [主要功能](#主要功能)
- [重要程式片段](#重要程式片段)
- [如何啟動](#如何啟動)
- [目前進度](#目前進度)
- [下一步建議](#下一步建議)
- [資料庫設計](#資料庫設計)
- [常見問題](#常見問題)

---

## 專案架構

```
src/
  app/
    globals.css
    layout.tsx
    components/
      client/
        notifications/
          NotificationList.tsx
        providers/
          AuthProvider.tsx
          QueryProvider.tsx
      server/
        Notification.tsx
    api/
      notifications/route.ts
      auth/[...nextauth]/route.ts
  data/
    query-options/notifications.ts
  lib/
    github.ts
    react-query.ts
```

---

## 技術棧

- Next.js 14 (App Router)
- React Query (資料快取與 hydration)
- NextAuth (GitHub OAuth 登入)
- Tailwind CSS (UI)
- Marp (本文件)

---

## 主要功能

- GitHub OAuth 登入
- 取得並顯示 GitHub 通知（/api/notifications 代理）
- 通知列表支援 SSR hydration + client-side cache
- 通知網址自動對映 type（Issue/PullRequest）
- 可讀性高的 UI 排版
- Prisma schema 支援通知分組與優先度（NotificationGroup/Notification）

---

## 重要程式片段

```ts
const TYPE_TO_PATH = { Issue: "issues", PullRequest: "pull" };
const [owner, repo] = full_name.split("/");
const [_, number] = apiUrl.match(/\/(\d+)$/) ?? [];
const path = TYPE_TO_PATH[type];
let webUrl = "https://github.com/notifications";
if (owner && repo && number && path) {
  webUrl = `https://github.com/${owner}/${repo}/${path}/${number}`;
}
```

---

## 如何啟動

```bash
npm install
npm run dev
```

---

## 目前進度

- [x] GitHub OAuth 登入
- [x] 取得/顯示 GitHub 通知
- [x] SSR + Hydration + React Query 快取
- [x] 通知網址 type-to-path 對映
- [x] 全域樣式與 UI 美化
- [x] Marp README 文件
- [x] Prisma schema：通知分組、優先度、型別、狀態
- [x] PAT bot 測試與 GitHub 通知觸發規則理解
- [x] 本地狀態管理（優先度、已讀狀態）
- [ ] Prisma 資料庫操作（CRUD）
- [ ] 通知分組邏輯實作
- [ ] 持久化儲存

---

## 下一步建議

- 支援更多通知型別
- 通知已讀/未讀狀態
- 搜尋與篩選
- 多語系

---

## 資料庫設計

Prisma schema 支援通知分組與優先度，主要模型如下：

```prisma
enum Priority {
  CRITICAL
  HIGH
  MEDIUM
  LOW
  IGNORED
}

enum NotificationType {
  PULL_REQUEST
  ISSUE
  COMMENT
  REPOSITORY
  SECURITY_ALERT
  DEPENDENCY_UPDATE
}

enum NotificationStatus {
  UNREAD
  READ
  ARCHIVED
}

model NotificationGroup {
  id          String    @id @default(cuid())
  type        NotificationType
  repository  String
  priority    Priority
  status      NotificationStatus @default(UNREAD)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  count       Int       @default(1)
  lastActivity DateTime @default(now())
  notifications Notification[]
}

model Notification {
  id          String            @id @default(cuid())
  title       String
  content     String
  type        NotificationType
  url         String
  sender      String
  createdAt   DateTime          @default(now())
  groupId     String
  group       NotificationGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  isRead      Boolean           @default(false)
}
```

這樣設計可支援：

- 通知依 repo/type/priority 分組
- 優先度（Priority）與狀態（Status）可用於 UI 分類與過濾
- 支援多型別通知（PR/Issue/Comment...）

> 注意：目前使用 localStorage 暫存本地狀態，尚未實作資料庫操作。

---

## 常見問題

### Q: 為什麼自己 assign/@自己、自己評論都收不到 GitHub 通知？

A: 這是 GitHub 的預設行為。只有「他人」對你操作（如 assign、@mention、review、邀請等）才會產生通知。自己對自己操作不會觸發通知。

### Q: PAT bot 建 issue/comment/assign，為什麼有時沒通知？

A: 如果 bot 與目標帳號相同，則不會收到通知。請用不同帳號測試。

### Q: Webhook URL 要填什麼？

A: 若僅用於測試，可填任意可訪問網址。正式環境可設為你自己的 API endpoint。
