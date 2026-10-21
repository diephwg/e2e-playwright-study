# Bài 03 — Viết test đầu tiên

## 1. Giải phẫu một test

```ts
import { test, expect } from '@playwright/test';

test('trang chủ có tiêu đề Playwright', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

| Phần | Ý nghĩa |
|------|---------|
| `import { test, expect }` | Lấy hai công cụ chính: `test` để khai báo test, `expect` để kiểm tra |
| `test('tên', ...)` | Khai báo một test case. Tên mô tả rõ hành vi được kiểm tra |
| `async ({ page }) => {...}` | Hàm chạy test. `page` là một tab trình duyệt mới, sạch, do Playwright cấp |
| `await page.goto(url)` | Mở trang và chờ tải xong |
| `await expect(page).toHaveTitle(...)` | Assertion: kiểm tra tiêu đề trang |

Mỗi test chạy trong một **browser context mới**: không có cookie, không có dữ liệu từ test trước. Các test độc lập với nhau.

## 2. Test thứ hai: todo app

Tạo `tests/todo.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('thêm một việc cần làm', async ({ page }) => {
  // Arrange
  await page.goto('https://demo.playwright.dev/todomvc');

  // Act
  await page.getByPlaceholder('What needs to be done?').fill('Mua sữa');
  await page.getByPlaceholder('What needs to be done?').press('Enter');

  // Assert
  await expect(page.getByTestId('todo-title')).toHaveText('Mua sữa');
});
```

Chạy:
```powershell
npx playwright test todo.spec.ts --headed
```

## 3. Đặt tên test

Tên tốt mô tả hành vi và kết quả:
- Tốt: `không cho đăng nhập khi sai mật khẩu`
- Tệ: `test 1`, `login test`

Khi test fail, tên là thứ đầu tiên bạn đọc trong báo cáo.

## 4. Nhiều test trong một file

```ts
test('thêm 1 việc', async ({ page }) => { /* ... */ });
test('thêm 2 việc', async ({ page }) => { /* ... */ });
```

Mỗi test tự mở trang của nó. Không dựa vào kết quả test trước.

## 5. Tránh hard-code `goto` đầy đủ URL

Trong `playwright.config.ts` đặt `baseURL`:

```ts
use: {
  baseURL: 'https://demo.playwright.dev',
},
```

Rồi trong test chỉ cần:
```ts
await page.goto('/todomvc');
```

Đổi môi trường (dev, staging) chỉ cần sửa một chỗ. Dự án `mosaic_web` lấy `baseURL` từ `.env` qua `utils/env.ts`.

## 6. Bỏ qua hoặc chỉ chạy một test

```ts
test.skip('chưa làm xong', async ({ page }) => {});
test.only('chỉ chạy cái này khi đang debug', async ({ page }) => {});
```

Đừng commit `test.only`. Config của `mosaic_web` có `forbidOnly` để chặn trên CI.

## Bài tập

Dùng https://demo.playwright.dev/todomvc, viết 3 test:
1. Thêm 2 việc, kiểm tra danh sách có 2 mục (`toHaveCount(2)`).
2. Thêm 1 việc rồi tick checkbox, kiểm tra việc đó có class `completed` (`toHaveClass(/completed/)`).
3. Thêm rồi xóa một việc (rê chuột vào mục, bấm nút X), kiểm tra danh sách trống.

Nếu kẹt, dùng `npx playwright codegen https://demo.playwright.dev/todomvc` để xem Playwright sinh code thế nào, rồi gõ lại bằng tay.
