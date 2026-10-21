# Bài 01 — Cài đặt và chạy test đầu tiên

## 1. Cài công cụ

1. **Node.js** (bản LTS): https://nodejs.org. Kiểm tra:
   ```powershell
   node -v
   npm -v
   ```
   Cả hai lệnh phải in ra số phiên bản.
2. **VS Code**: https://code.visualstudio.com. Cài thêm extension **Playwright Test for VSCode** (của Microsoft). Extension cho phép bấm nút chạy từng test ngay trong editor.
3. **Git** (tùy chọn nhưng nên có): https://git-scm.com.

## 2. Tạo project luyện tập

Tạo thư mục riêng, **không** làm trong `mosaic_web`:

```powershell
mkdir playwright-hoc
cd playwright-hoc
npm init playwright@latest
```

Trả lời các câu hỏi:
- Language: **TypeScript**
- Tests folder: **tests**
- Add GitHub Actions workflow: **No** (học sau)
- Install Playwright browsers: **Yes**

## 3. Cấu trúc thư mục sinh ra

```
playwright-hoc/
├─ tests/
│  └─ example.spec.ts      ← test mẫu
├─ tests-examples/         ← ví dụ todo app, để tham khảo
├─ playwright.config.ts    ← cấu hình
├─ package.json
└─ node_modules/
```

- `tests/` chứa file test. Tên file phải kết thúc `.spec.ts` (hoặc `.test.ts`).
- `playwright.config.ts` điều khiển trình duyệt nào, timeout, báo cáo...

## 4. Chạy test

```powershell
npx playwright test
```

Mặc định chạy headless trên 3 trình duyệt (chromium, firefox, webkit). Kết quả hiện trong terminal.

Xem báo cáo HTML:
```powershell
npx playwright show-report
```

Các biến thể hay dùng:

| Lệnh | Tác dụng |
|------|----------|
| `npx playwright test --headed` | Hiện cửa sổ trình duyệt |
| `npx playwright test --ui` | Mở UI Mode, chạy và xem từng bước |
| `npx playwright test --project=chromium` | Chỉ chạy Chromium |
| `npx playwright test example.spec.ts` | Chỉ chạy một file |
| `npx playwright test -g "has title"` | Chỉ chạy test có tên chứa "has title" |
| `npx playwright test --debug` | Chạy từng bước với Inspector |

## 5. Đọc test mẫu

Mở `tests/example.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

Giải thích từng dòng ở bài 03.

## 6. Chỉ chạy Chromium cho nhanh

Mở `playwright.config.ts`, tìm mảng `projects` và xóa (hoặc comment) `firefox` và `webkit`. Khi mới học, một trình duyệt là đủ.

## Lỗi thường gặp

| Lỗi | Cách xử lý |
|-----|-----------|
| `npx : File ... cannot be loaded because running scripts is disabled` | Chạy PowerShell: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `Executable doesn't exist` | Chạy `npx playwright install` |
| Test treo, không chạy | Kiểm tra mạng, hoặc tăng `timeout` trong config |

## Bài tập

1. Chạy `npx playwright test --headed` và quan sát trình duyệt tự mở.
2. Chạy `npx playwright test --ui`, bấm vào một test, xem từng bước và ảnh chụp trang.
3. Cố ý sửa `/Playwright/` thành `/Selenium/`, chạy lại, đọc thông báo lỗi. Test fail như thế nào? Báo cáo HTML ghi gì?
