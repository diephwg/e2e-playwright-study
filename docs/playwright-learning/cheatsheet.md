# Cheatsheet Playwright

## Lệnh CLI

| Lệnh | Tác dụng |
|------|----------|
| `npm init playwright@latest` | Tạo project mới |
| `npx playwright test` | Chạy tất cả test |
| `npx playwright test file.spec.ts` | Chạy một file |
| `npx playwright test -g "tên"` | Chạy test có tên khớp |
| `npx playwright test --grep @smoke` | Chạy theo tag |
| `npx playwright test --project=chromium` | Chọn project/trình duyệt |
| `npx playwright test --headed` | Hiện trình duyệt |
| `npx playwright test --ui` | UI Mode |
| `npx playwright test --debug` | Inspector, chạy từng bước |
| `npx playwright test --workers=1` | Chạy tuần tự |
| `npx playwright test --repeat-each=10` | Lặp mỗi test 10 lần (kiểm tra flaky) |
| `npx playwright test --last-failed` | Chỉ chạy lại test fail lần trước |
| `npx playwright show-report` | Mở báo cáo HTML |
| `npx playwright show-trace trace.zip` | Mở trace |
| `npx playwright codegen <url>` | Ghi thao tác thành code |
| `npx playwright install` | Cài trình duyệt |

## Khung test

```ts
import { test, expect } from '@playwright/test';

test.describe('Nhóm', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('mô tả hành vi', async ({ page }) => {
    await test.step('bước 1', async () => { /* ... */ });
    await expect(page).toHaveURL(/abc/);
  });
});
```

## Locator

```ts
page.getByRole('button', { name: 'Lưu' })
page.getByLabel('Email')
page.getByPlaceholder('Tìm...')
page.getByText('Xin chào')
page.getByTestId('id')
page.locator('css')
loc.filter({ hasText: 'x' })
loc.locator('con')
loc.first() / loc.last() / loc.nth(i)
```

## Action

```ts
await loc.click()          await loc.dblclick()
await loc.fill('x')        await loc.clear()
await loc.press('Enter')   await loc.hover()
await loc.check()          await loc.uncheck()
await loc.selectOption('v')
await loc.setInputFiles('path')
await loc.dragTo(loc2)
await page.goto(url)       await page.reload()
await page.goBack()
```

## Assertion

```ts
await expect(loc).toBeVisible()
await expect(loc).toBeHidden()
await expect(loc).toBeEnabled()
await expect(loc).toBeDisabled()
await expect(loc).toBeChecked()
await expect(loc).toHaveText('x')
await expect(loc).toContainText('x')
await expect(loc).toHaveValue('x')
await expect(loc).toHaveCount(n)
await expect(loc).toHaveClass(/x/)
await expect(loc).toHaveAttribute('href', '/x')
await expect(page).toHaveURL(/x/)
await expect(page).toHaveTitle(/x/)
await expect(loc).not.toBeVisible()
await expect.soft(loc).toHaveText('x')
```

## Mạng và API

```ts
await page.route('**/api/x', (r) => r.fulfill({ json: {} }));
await page.waitForResponse('**/api/x');
const res = await request.get(url);       // fixture request
const body = await res.json();
```

## Cấu hình hay dùng

```ts
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

## Quy tắc nhớ nhanh

- Gần như mọi lệnh Playwright đều cần `await`.
- Ưu tiên `getByRole` / `getByLabel`.
- Dùng `await expect(locator)...`, không dùng `isVisible()` để kiểm tra.
- Không dùng `waitForTimeout`.
- Mỗi test độc lập và tự tạo dữ liệu.
- Secret để trong `.env`, không commit.
