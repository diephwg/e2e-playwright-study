# Bài 06 — Auto-wait và debug

## 1. Auto-wait

Trước mỗi action (`click`, `fill`...), Playwright tự chờ phần tử:
- có trong DOM,
- hiển thị,
- ổn định (không đang chuyển động),
- bật (enabled),
- không bị phần tử khác che.

Hết `actionTimeout` mà vẫn chưa đủ điều kiện thì test fail kèm giải thích đang chờ gì.

Hệ quả: **hầu như không cần viết lệnh chờ thủ công.**

### Không dùng

```ts
await page.waitForTimeout(5000);   // chờ cứng, chậm và vẫn flaky
```

### Dùng

```ts
await expect(page.getByText('Đã lưu')).toBeVisible();
await page.waitForURL('**/done');
await page.waitForResponse('**/api/save');
```

Chờ theo **điều kiện**, không chờ theo **thời gian**.

## 2. Timeout

Có nhiều lớp timeout, cấu hình ở `playwright.config.ts`:

```ts
export default defineConfig({
  timeout: 30_000,              // tối đa cho cả một test
  expect: { timeout: 5_000 },   // mỗi assertion
  use: {
    actionTimeout: 10_000,      // mỗi action (click, fill)
    navigationTimeout: 30_000,  // mỗi lần goto
  },
});
```

Đặt riêng cho một test:
```ts
test('test chậm', async ({ page }) => {
  test.setTimeout(120_000);
});
```

## 3. Debug: các công cụ

### 3.1 UI Mode (khuyên dùng khi học)

```powershell
npx playwright test --ui
```
Xem từng bước, ảnh chụp trước/sau, locator, log mạng. Bấm giờ ở timeline để xem trang tại thời điểm đó.

### 3.2 Debug mode / Inspector

```powershell
npx playwright test todo.spec.ts --debug
```
Chạy từng dòng. Có nút Step over, Resume và Pick locator.

Hoặc đặt điểm dừng trong code:
```ts
await page.pause();
```

### 3.3 Chạy có giao diện

```powershell
npx playwright test --headed
```
Để chạy chậm cho dễ nhìn, đặt `slowMo` trong config (mili giây giữa các thao tác):
```ts
use: { launchOptions: { slowMo: 500 } }
```

### 3.4 Trace Viewer (rất mạnh)

Cấu hình ghi trace khi test fail (dự án `mosaic_web` đang dùng):
```ts
use: { trace: 'retain-on-failure' }
```
Mở trace:
```powershell
npx playwright show-trace test-results/<thư-mục-test>/trace.zip
```
Trace chứa mọi bước, ảnh DOM, request mạng, console. Dùng trace để điều tra test fail trên CI mà bạn không tận mắt thấy.

### 3.5 Screenshot và video

```ts
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```
Chụp thủ công:
```ts
await page.screenshot({ path: 'anh.png', fullPage: true });
```

### 3.6 Báo cáo HTML

```powershell
npx playwright show-report
```

## 4. Codegen: ghi thao tác thành code

```powershell
npx playwright codegen https://demo.playwright.dev/todomvc
```
Thao tác trên trình duyệt, code sinh ra ở cửa sổ Inspector. Dùng để học cú pháp và tìm locator. Không copy nguyên xi làm test chính thức: thiếu assertion và đặt tên test chưa tốt.

## 5. Quy trình xử lý khi test fail

1. Đọc thông báo lỗi và dòng code bị lỗi.
2. Đọc **Call log**: Playwright đang chờ gì?
3. Mở trace hoặc UI Mode: trang lúc đó trông thế nào?
4. Phân loại nguyên nhân:
   - **Locator sai/đổi** → sửa locator.
   - **Dữ liệu thay đổi** → sửa dữ liệu test hoặc tạo dữ liệu riêng.
   - **Lỗi thật của ứng dụng** → báo bug.
   - **Chờ chưa đủ** → thay bằng assertion/điều kiện chờ đúng.
5. Chạy lại 5-10 lần (`--repeat-each=10`) để chắc chắn không flaky.

## 6. Nguyên nhân test flaky thường gặp

- Dùng `waitForTimeout`.
- Dùng `isVisible()` thay vì `expect(...).toBeVisible()`.
- Test phụ thuộc thứ tự hoặc dữ liệu của test khác.
- Dữ liệu chung bị nhiều người dùng cùng lúc.
- Locator khớp nhiều phần tử, chọn nhầm theo thứ tự.

## Bài tập

1. Chạy một test bằng `--ui`, bấm vào từng bước và quan sát.
2. Cố ý sai một locator, đọc Call log, mở trace và tìm ra lỗi.
3. Thêm `await page.pause();` vào giữa test todo, dùng Inspector để thử `getByRole` ngay trên trang.
4. Chạy `npx playwright test --repeat-each=5` trên một test của bạn để kiểm tra độ ổn định.
