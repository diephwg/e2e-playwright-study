# Bài 07 — Tổ chức test

## 1. `test.describe`: nhóm test

```ts
import { test, expect } from '@playwright/test';

test.describe('Todo - thêm việc', () => {
  test('thêm một việc', async ({ page }) => { /* ... */ });
  test('không thêm việc rỗng', async ({ page }) => { /* ... */ });
});
```

Nhóm giúp báo cáo gọn và áp hook chung cho cả nhóm.

## 2. Hook: chạy trước/sau mỗi test

```ts
test.describe('Todo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test.afterEach(async ({ page }) => {
    // dọn dẹp nếu cần
  });

  test('thêm việc', async ({ page }) => { /* trang đã mở sẵn */ });
});
```

| Hook | Chạy khi |
|------|----------|
| `beforeEach` | Trước từng test |
| `afterEach` | Sau từng test |
| `beforeAll` | Một lần trước cả nhóm |
| `afterAll` | Một lần sau cả nhóm |

Dùng `beforeEach` cho bước mở trang/đăng nhập lặp lại ở mọi test.

## 3. `test.step`: chia bước trong báo cáo

```ts
test('mua hàng', async ({ page }) => {
  await test.step('Thêm vào giỏ', async () => { /* ... */ });
  await test.step('Thanh toán', async () => { /* ... */ });
});
```
Báo cáo và trace hiển thị theo từng bước có tên.

## 4. Fixture: thứ Playwright chuẩn bị cho test

`page`, `context`, `browser`, `request` đều là fixture. Bạn tự tạo fixture riêng để chia sẻ đối tượng dùng chung.

```ts
// utils/fixtures.ts
import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

export const test = base.extend<{ todo: TodoPage }>({
  todo: async ({ page }, use) => {
    const todo = new TodoPage(page);
    await todo.open();
    await use(todo);        // test chạy ở đây
  },
});
export { expect } from '@playwright/test';
```

```ts
// tests/todo.spec.ts
import { test, expect } from '../utils/fixtures';

test('thêm việc', async ({ todo }) => {
  await todo.them('Mua sữa');
  await expect(todo.items).toHaveCount(1);
});
```

`mosaic_web` làm đúng như vậy trong `utils/test-fixtures.ts` (fixture `shell`...). Hãy mở file này đọc sau khi học xong bài 08.

## 5. Tag và lọc test

```ts
test('đăng nhập đúng @smoke', async ({ page }) => { /* ... */ });

test('báo cáo chi tiết', { tag: '@slow' }, async ({ page }) => { /* ... */ });
```

Chạy theo tag:
```powershell
npx playwright test --grep @smoke
npx playwright test --grep-invert @slow
```

`mosaic_web` có các lệnh `npm run smoke:task`, `smoke:customer`... dựa trên `--grep @smoke`.

## 6. Tham số hóa: một test, nhiều dữ liệu

```ts
const caNhap = [
  { email: '', matKhau: '123', loi: 'Email bắt buộc' },
  { email: 'a@mail.com', matKhau: '', loi: 'Mật khẩu bắt buộc' },
];

for (const c of caNhap) {
  test(`đăng nhập lỗi: ${c.loi}`, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(c.email);
    await page.getByLabel('Mật khẩu').fill(c.matKhau);
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await expect(page.getByText(c.loi)).toBeVisible();
  });
}
```
Tên test phải khác nhau (đưa dữ liệu vào tên).

## 7. Chạy song song và theo thứ tự

Mặc định các **file** chạy song song, test trong một file chạy tuần tự.

```ts
// playwright.config.ts
fullyParallel: true,   // test trong cùng file cũng chạy song song
workers: 4,
```

Test song song **phải độc lập về dữ liệu**. Nếu test dùng chung một tài khoản/bản ghi, đặt `workers: 1` hoặc tạo dữ liệu riêng cho mỗi test. `mosaic_web` đặt `fullyParallel: false` và `workers: 1` vì lý do này.

Chạy tuần tự trong một nhóm:
```ts
test.describe.configure({ mode: 'serial' });
```
Dùng hạn chế: nếu một test fail, các test sau bị bỏ qua.

## 8. Biến môi trường và `.env`

Không để mật khẩu trong code. Đặt trong file `.env` (không commit lên git):

```
BASE_URL=https://staging.example.com
USER_EMAIL=qa@example.com
USER_PASSWORD=******
```

Đọc trong code: `process.env.USER_EMAIL`. `mosaic_web` gom việc này vào `utils/env.ts`; file mẫu là `.env.example`.

## 9. `playwright.config.ts` — các mục chính

```ts
export default defineConfig({
  testDir: './tests',
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

## Bài tập

Viết lại các test todo ở bài 03 theo cấu trúc:
1. Gom vào `test.describe('Todo')`.
2. Dùng `beforeEach` để mở trang.
3. Gắn tag `@smoke` cho một test, chạy riêng bằng `--grep @smoke`.
4. Dùng vòng lặp tham số hóa để thêm 3 việc có tên khác nhau và kiểm tra từng cái.
