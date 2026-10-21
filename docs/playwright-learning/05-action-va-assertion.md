# Bài 05 — Thao tác và kiểm tra kết quả

## 1. Action: làm việc với trang

```ts
// Điều hướng
await page.goto('/login');
await page.goBack();
await page.reload();

// Click
await page.getByRole('button', { name: 'Lưu' }).click();
await page.getByText('Menu').dblclick();
await page.getByText('Mục').click({ button: 'right' });
await page.getByText('Mục').hover();

// Nhập text
await page.getByLabel('Email').fill('a@mail.com');       // xóa nội dung cũ rồi nhập
await page.getByLabel('Tìm').pressSequentially('abc');   // gõ từng phím (khi cần)
await page.getByLabel('Tìm').press('Enter');
await page.getByLabel('Email').clear();

// Checkbox / radio
await page.getByLabel('Đồng ý').check();
await page.getByLabel('Đồng ý').uncheck();

// Dropdown <select>
await page.getByLabel('Quốc gia').selectOption('VN');
await page.getByLabel('Quốc gia').selectOption({ label: 'Việt Nam' });

// Upload file
await page.getByLabel('Chọn file').setInputFiles('data/mau.csv');

// Kéo thả
await page.getByText('Mục A').dragTo(page.getByText('Vùng B'));
```

`fill` dùng cho 95% trường hợp. `pressSequentially` chỉ dùng khi ô nhập có xử lý riêng theo từng phím (autocomplete).

## 2. Lấy thông tin từ trang

```ts
const text = await page.getByTestId('tong').textContent();
const value = await page.getByLabel('Email').inputValue();
const dem = await page.getByRole('listitem').count();
const hienThi = await page.getByText('OK').isVisible();
const url = page.url();
const tieuDe = await page.title();
```

Các hàm `isVisible()`, `count()`... **không chờ**, chỉ trả về trạng thái tại thời điểm gọi. Với kiểm tra, ưu tiên `expect` (có chờ), xem phần 3.

## 3. Assertion: kiểm tra với `expect`

### Web-first assertion (có tự chờ và thử lại)

```ts
const nut = page.getByRole('button', { name: 'Lưu' });

await expect(nut).toBeVisible();
await expect(nut).toBeHidden();
await expect(nut).toBeEnabled();
await expect(nut).toBeDisabled();

await expect(page.getByLabel('Email')).toHaveValue('a@mail.com');
await expect(page.getByTestId('tong')).toHaveText('100');
await expect(page.getByTestId('tong')).toContainText('10');
await expect(page.getByRole('listitem')).toHaveCount(3);
await expect(page.getByLabel('Đồng ý')).toBeChecked();
await expect(page.getByRole('listitem').first()).toHaveClass(/completed/);

await expect(page).toHaveURL(/dashboard/);
await expect(page).toHaveTitle(/Trang chủ/);
```

`await expect(locator).toXxx()` thử lại cho đến khi đúng hoặc hết `expect.timeout` (mặc định 5 giây). Đây là cách kiểm tra nên dùng.

### Assertion thường (không chờ)

```ts
expect(tong).toBe(100);
expect(ds).toContain('a');
expect(ds.length).toBeGreaterThan(0);
expect(ten).toEqual('Lan');
```

Dùng cho giá trị đã lấy ra biến, không còn là locator.

### Phủ định

```ts
await expect(page.getByText('Lỗi')).not.toBeVisible();
```

## 4. Sai lầm phổ biến

| Sai | Đúng |
|-----|------|
| `expect(await el.isVisible()).toBe(true)` | `await expect(el).toBeVisible()` |
| `expect(await el.textContent()).toBe('A')` | `await expect(el).toHaveText('A')` |
| Quên `await` trước `expect(locator)` | Luôn `await expect(locator)...` |

Dạng sai ở cột trái không tự chờ, nên dễ flaky.

## 5. Soft assertion

Tiếp tục test dù một kiểm tra fail, báo hết lỗi ở cuối:

```ts
await expect.soft(page.getByTestId('ten')).toHaveText('Lan');
await expect.soft(page.getByTestId('tuoi')).toHaveText('25');
```

Dùng khi kiểm tra nhiều trường độc lập trên cùng một màn hình.

## 6. Chờ điều kiện đặc biệt

```ts
await page.waitForURL('**/dashboard');
await page.waitForResponse((r) => r.url().includes('/api/users') && r.status() === 200);
// Thử lại một hàm bất kỳ cho đến khi đúng
await expect.poll(async () => page.getByRole('listitem').count()).toBeGreaterThan(0);
```

## Bài tập

Trên https://the-internet.herokuapp.com:
1. `/login` — đăng nhập `tomsmith` / `SuperSecretPassword!`, kiểm tra URL chứa `/secure` và thấy thông báo "You logged into a secure area!".
2. `/login` — đăng nhập sai, kiểm tra thấy thông báo lỗi.
3. `/checkboxes` — check ô thứ nhất, bỏ check ô thứ hai, kiểm tra trạng thái cả hai.
4. `/dropdown` — chọn "Option 2", kiểm tra giá trị là `2`.
5. `/upload` — upload một file nhỏ, kiểm tra thấy tên file trong kết quả.
