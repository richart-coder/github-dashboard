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
- [資料庫設計](#資料庫設計)
- [常見問題](#常見問題)

---

## 專案架構

```
src/
  app/
    (dashboard)/
      notifications/
        page.tsx
      repositories/
        page.tsx
    api/
      repositories/
        [owner]/[repo]/activate/route.ts
        [owner]/[repo]/preferences/route.ts
      notifications/[threadId]/read/route.ts
  components/
    client/
      notifications/
        RepoList.tsx
        RepoNotificationSetting.tsx
  repositories/
    repo-preference.ts
  services/
    auth.ts
    octokit.ts
  adapters/
    notificationAdapter.ts
  viewModels/
    createRepositoryViewModel.ts
  lib/
    auth-config.ts
    prisma.ts
```

---

## 技術棧

- Next.js 14 (App Router)
- React Query (資料快取與 hydration)
- NextAuth (GitHub OAuth 登入)
- Prisma (ORM)
- Tailwind CSS (UI)
- TypeScript

---

## 主要功能

- GitHub OAuth 登入
- 取得並顯示 GitHub 通知
- Repository 偏好設定（啟用/忽略型別）
- 通知已讀/未讀狀態同步
- SSR + React Query 快取
- Prisma schema 支援 repository 偏好與通知
- Adapter/service/viewModel 模組化

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
npx prisma migrate dev
npm run dev
```

- 請設定 `.env` 檔案，包含 GitHub OAuth 與資料庫連線資訊

---

## 資料庫設計

```prisma
model RepositoryPreference {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  repository   String   /// owner/repoName
  isActive     Boolean  @default(false)
  ignoredTypes String   /// '["Issue", "PullRequest", "Commit"]'
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([userId, repository])
}
```

---

## 常見問題

### Q: 為什麼 mutation API 還是回傳更新後的資料？

A: 這是良好 API 設計原則，方便前端未來擴充、optimistic UI 或 debug。

### Q: 為什麼 mutation 後前端不用回傳值而是重新 query？

A: 這樣可確保資料一致性，避免快取與實際狀態不同步。

### Q: 為什麼自己 assign/@自己、自己評論都收不到 GitHub 通知？

A: 這是 GitHub 的預設行為。只有「他人」對你操作（如 assign、@mention、review、邀請等）才會產生通知。自己對自己操作不會觸發通知。

### Q: PAT bot 建 issue/comment/assign，為什麼有時沒通知？

A: 如果 bot 與目標帳號相同，則不會收到通知。請用不同帳號測試。

### Q: Webhook URL 要填什麼？

A: 若僅用於測試，可填任意可訪問網址。正式環境可設為你自己的 API endpoint
