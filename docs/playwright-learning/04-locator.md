# Bài 04 — Locator: tìm phần tử trên trang

Locator là cách bạn nói với Playwright: "phần tử này". Chọn locator tốt quyết định test có bền hay hay vỡ.

## 1. Thứ tự ưu tiên

Chọn locator theo cách người dùng nhìn thấy trang, từ ưu tiên cao xuống thấp:

| Ưu tiên | Locator | Ví dụ |
|---------|---------|-------|
| 1 | `getByRole` | `page.getByRole('button', { name: 'Đăng nhập' })` |
| 2 | `getByLabel` | `page.getByLabel('Email')` |
| 3 | `getByPlaceholder` | `page.getByPlaceholder('Nhập email')` |
| 4 | `getByText` | `page.getByText('Chào mừng')` |
| 5 | `getByTestId` | `page.getByTestId('submit-btn')` (cần dev thêm `data-testid`) |
| 6 | CSS / XPath | `page.locator('.btn-primary')` — dùng khi không còn lựa chọn |

Lý do: role, label, text ít đổi khi dev sửa giao diện. Class CSS và XPath dài rất dễ vỡ.

## 2. Các locator chính

```ts
// Nút, link, ô nhập... theo vai trò
page.getByRole('button', { name: 'Lưu' });
page.getByRole('link', { name: 'Docs' });
page.getByRole('textbox', { name: 'Email' });
page.getByRole('checkbox', { name: 'Ghi nhớ' });
page.getByRole('heading', { name: 'Đăng nhập' });

// Theo nhãn của input
page.getByLabel('Mật khẩu');

// Theo text hiển thị
page.getByText('Thành công');
page.getByText('Thành công', { exact: true });

// Theo placeholder
page.getByPlaceholder('Tìm kiếm...');

// Theo data-testid
page.getByTestId('todo-title');

// CSS
page.locator('button.primary');
page.locator('#username');
page.locator('[data-id="12"]');
```

## 3. Lọc và thu hẹp

```ts
// Locator lồng nhau: tìm trong một vùng
const hang = page.getByRole('row', { name: 'Nguyễn Văn A' });
await hang.getByRole('button', { name: 'Sửa' }).click();

// Lọc theo text
page.getByRole('listitem').filter({ hasText: 'Mua sữa' });

// Lấy phần tử thứ n (bắt đầu từ 0)
page.getByRole('listitem').first();
page.getByRole('listitem').last();
page.getByRole('listitem').nth(2);
```

Cách thu hẹp theo vùng (`hang.getByRole(...)`) tốt hơn dùng `.nth()` vì không phụ thuộc thứ tự.

## 4. Strict mode

Nếu locator khớp **nhiều hơn 1** phần tử và bạn gọi `click()`, Playwright báo lỗi:

```
Error: strict mode violation: getByRole('button') resolved to 3 elements
```

Cách sửa: làm locator cụ thể hơn (thêm `name`, thu hẹp vùng), hoặc cố ý dùng `.first()` khi thực sự cần.

## 5. Đếm và lặp qua nhiều phần tử

```ts
await expect(page.getByRole('listitem')).toHaveCount(3);

const items = await page.getByRole('listitem').allTextContents();
console.log(items);   // ['Mua sữa', 'Đi chợ', ...]
```

## 6. Tìm locator bằng công cụ

- `npx playwright codegen <url>`: bấm vào phần tử, Playwright gợi ý locator.
- Extension VS Code: nút **Pick locator**.
- UI Mode (`--ui`): tab **Locator**, bấm chọn phần tử trên trang.

Luôn đọc lại locator được gợi ý. Công cụ đôi khi chọn CSS dài, hãy đổi sang `getByRole`/`getByLabel` nếu được.

## 7. Iframe và Shadow DOM (chỉ cần biết)

```ts
// Phần tử trong iframe
page.frameLocator('#my-frame').getByRole('button', { name: 'OK' });
```

Locator của Playwright mặc định xuyên qua Shadow DOM mở, không cần xử lý thêm.

## Bài tập

Trên https://demo.playwright.dev/todomvc, viết locator (chỉ in ra `count()` hoặc `textContent()` để kiểm tra) cho:
1. Ô nhập việc mới (bằng placeholder).
2. Tiêu đề của mục thứ hai trong danh sách.
3. Nút "Clear completed".
4. Link filter "Active".
5. Số đếm "items left" ở chân trang.

Trên https://the-internet.herokuapp.com/tables: tìm hàng có email `jsmith@gmail.com` rồi lấy ô "Due".
