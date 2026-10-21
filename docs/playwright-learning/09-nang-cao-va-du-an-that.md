# Bài 09 — Nâng cao và đọc dự án thật (`mosaic_web`)

## 1. API testing

Playwright gọi API trực tiếp, không cần trình duyệt:

```ts
import { test, expect } from '@playwright/test';

test('GET danh sách user', async ({ request }) => {
  const res = await request.get('https://reqres.in/api/users?page=2');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.data.length).toBeGreaterThan(0);
});

test('POST tạo user', async ({ request }) => {
  const res = await request.post('https://reqres.in/api/users', {
    data: { name: 'Lan', job: 'QA' },
  });
  expect(res.ok()).toBeTruthy();
});
```

Ứng dụng hay gặp: dùng API để **tạo dữ liệu nhanh** trước khi test UI, hoặc **dọn dữ liệu** sau test.

## 2. Mock và theo dõi mạng

```ts
// Chặn và trả dữ liệu giả
await page.route('**/api/users', (route) =>
  route.fulfill({ json: [{ id: 1, name: 'Giả' }] })
);

// Chờ một request cụ thể sau khi bấm nút
const [res] = await Promise.all([
  page.waitForResponse('**/api/save'),
  page.getByRole('button', { name: 'Lưu' }).click(),
]);
expect(res.status()).toBe(200);
```

Mock hữu ích để test trường hợp lỗi (500, danh sách rỗng) khó tạo trên hệ thống thật.

## 3. Hộp thoại, tab mới, tải file

```ts
// alert/confirm
page.once('dialog', (d) => d.accept());
await page.getByRole('button', { name: 'Xóa' }).click();

// tab mới
const [tabMoi] = await Promise.all([
  page.context().waitForEvent('page'),
  page.getByRole('link', { name: 'Mở' }).click(),
]);

// tải file xuống
const [file] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Xuất Excel' }).click(),
]);
await file.saveAs('tmp/ketqua.xlsx');
```

## 4. Chạy trên CI (GitHub Actions)

`.github/workflows/playwright.yml`:

```yaml
name: Playwright
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: lts/* }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

Đặt thông tin nhạy cảm vào GitHub Secrets, không ghi trong file.

## 5. Nguyên tắc viết test tốt

1. **Độc lập**: mỗi test tự chuẩn bị dữ liệu, chạy riêng lẻ hay theo thứ tự nào cũng pass.
2. **Một test, một mục đích**: tên nói rõ kiểm tra gì.
3. **Locator hướng người dùng**: role, label, text.
4. **Không chờ cứng**: dùng assertion và điều kiện chờ.
5. **Kiểm tra kết quả thật sự**: không chỉ kiểm tra "không lỗi", hãy kiểm tra dữ liệu/thông báo/URL đúng.
6. **Tự dọn dẹp** dữ liệu đã tạo.
7. **Không phụ thuộc môi trường ngoài** khi không cần: mock dịch vụ bên thứ ba.

## 6. Đọc code dự án `mosaic_web`

Đọc theo thứ tự, mỗi bước mất khoảng 15-30 phút:

| Bước | File | Học được gì |
|------|------|-------------|
| 1 | `package.json` | Các script `npm run ...` (smoke, flow, ui) |
| 2 | `playwright.config.ts` | Project `setup`, `chromium`, timeout, trace, video, `workers: 1` |
| 3 | `utils/env.ts` | Đọc biến môi trường |
| 4 | `tests/setup/` + `utils/auth-state.ts` | Đăng nhập một lần, lưu session |
| 5 | `utils/test-fixtures.ts` | Fixture tự tạo (`shell`...) |
| 6 | `pages/common/app-shell.page.ts` | Page Object của menu/header |
| 7 | `tests/common/navigation.spec.ts` | Test ngắn gọn, dễ đọc, tham số hóa bằng vòng lặp |
| 8 | `pages/customer/` và `tests/customer/customer-list.spec.ts` | POM + test của một chức năng |
| 9 | `tests/customer/customer-flow.spec.ts` | Test luồng end-to-end |
| 10 | `utils/db.ts` | Kết nối MongoDB để chuẩn bị/kiểm tra dữ liệu |

Thực hành:
```powershell
npx playwright test tests/common/navigation.spec.ts --project=chromium --ui
npm run smoke:customer:headed
```

(Cần file `.env` đúng và truy cập được môi trường test, hỏi người phụ trách nếu chưa có.)

## 7. Lộ trình sau tài liệu này

- Học sâu hơn: https://playwright.dev/docs/best-practices
- Visual testing: `expect(page).toHaveScreenshot()`
- Test đa trình duyệt, thiết bị di động (`devices['iPhone 13']`)
- Accessibility testing với `@axe-core/playwright`
- Báo cáo nâng cao: Allure, Playwright HTML report trên CI
- Thiết kế test: phân vùng tương đương, giá trị biên, ma trận quyền (đã có trong các file `docs/*.xlsx` của dự án)

## Bài tập cuối khóa

Chọn một trang web bạn quen (hoặc https://demo.playwright.dev/todomvc, https://the-internet.herokuapp.com) và tự xây project mini:
1. Tối thiểu 10 test case, trong đó có thành công, lỗi và trường hợp biên.
2. Có Page Object và fixture.
3. Dùng `baseURL` và `.env`.
4. Có tag `@smoke` và script `npm run smoke`.
5. Có ít nhất 1 test API và 1 test dùng `page.route` để mock.
6. Chạy trên GitHub Actions và đính kèm báo cáo.
