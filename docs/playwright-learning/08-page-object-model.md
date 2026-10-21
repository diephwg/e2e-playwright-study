# Bài 08 — Page Object Model (POM) và đăng nhập một lần

## 1. Vấn đề

Khi test nhiều, cùng một locator lặp ở hàng chục file:

```ts
await page.getByLabel('Email').fill(...);
await page.getByLabel('Mật khẩu').fill(...);
await page.getByRole('button', { name: 'Đăng nhập' }).click();
```

Nếu giao diện đổi, bạn sửa ở hàng chục nơi.

## 2. Giải pháp: Page Object

Mỗi trang (hoặc vùng) của ứng dụng là một **class**. Class chứa:
- **Locator** của trang đó.
- **Hàm hành động** (đăng nhập, thêm việc...).

Test chỉ gọi hàm, không biết locator cụ thể. Giao diện đổi thì sửa một chỗ.

### Ví dụ: `pages/todo.page.ts`

```ts
import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly oNhap: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
    this.oNhap = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-title');
  }

  async open() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async them(ten: string) {
    await this.oNhap.fill(ten);
    await this.oNhap.press('Enter');
  }

  async hoanThanh(ten: string) {
    await this.page
      .getByRole('listitem')
      .filter({ hasText: ten })
      .getByRole('checkbox')
      .check();
  }
}
```

### Test dùng Page Object

```ts
import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

test('thêm việc', async ({ page }) => {
  const todo = new TodoPage(page);
  await todo.open();
  await todo.them('Mua sữa');
  await expect(todo.items).toHaveText(['Mua sữa']);
});
```

## 3. Quy tắc thiết kế

1. Page Object chứa **locator và hành động**. Phần **assertion** thường để trong test, để test đọc thấy rõ đang kiểm tra gì.
2. Tên hàm theo ngôn ngữ nghiệp vụ: `dangNhap()`, `taoKhachHang()`, không phải `clickNutLuu()`.
3. Mỗi trang một file. Đặt trong `pages/`.
4. Phần dùng chung (menu, header) tách thành component riêng, ví dụ `AppShell`.
5. Đừng bọc mọi thứ quá mức. Test ngắn đôi khi không cần POM.

## 4. Kết hợp Page Object với fixture

Thay vì `new TodoPage(page)` trong mỗi test, tạo fixture (xem bài 07):

```ts
export const test = base.extend<{ todo: TodoPage }>({
  todo: async ({ page }, use) => {
    const todo = new TodoPage(page);
    await todo.open();
    await use(todo);
  },
});
```
Test chỉ cần `async ({ todo }) => {...}`.

## 5. Đăng nhập một lần: `storageState`

Đăng nhập ở mọi test rất chậm. Cách làm: đăng nhập **một lần**, lưu cookie/session vào file, các test sau dùng lại.

### Bước 1: file setup `tests/auth.setup.ts`

```ts
import { test as setup, expect } from '@playwright/test';

const FILE = 'playwright/.auth/user.json';

setup('đăng nhập', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.USER_EMAIL!);
  await page.getByLabel('Mật khẩu').fill(process.env.USER_PASSWORD!);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page).toHaveURL(/dashboard/);
  await page.context().storageState({ path: FILE });
});
```

### Bước 2: khai báo trong `playwright.config.ts`

```ts
projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],
  },
],
```

Project `setup` chạy trước, `chromium` dùng session đã lưu nên mọi test mở ra là đã đăng nhập. Thêm `playwright/.auth` vào `.gitignore`.

`mosaic_web` làm đúng như vậy: xem `tests/setup/` và `utils/auth-state.ts` (`AUTH_FILE`).

## 6. Dữ liệu test

- Dữ liệu ngẫu nhiên để tránh trùng: `` `KH_${Date.now()}` ``. Xem `utils/random.ts` và `utils/date.ts` trong dự án.
- Dữ liệu cố định để trong thư mục `data/`.
- Tự tạo dữ liệu cần thiết ở đầu test, tự dọn ở cuối. Đừng dựa vào dữ liệu "có sẵn" do người khác nhập.

## Bài tập

1. Tạo `pages/login.page.ts` cho https://the-internet.herokuapp.com/login với các hàm `open()`, `dangNhap(user, pass)` và locator thông báo `flash`.
2. Viết lại 2 test đăng nhập (đúng/sai) ở bài 05 bằng Page Object.
3. Tạo fixture `loginPage` và dùng trong test.
4. Đọc `pages/common/app-shell.page.ts` và `utils/test-fixtures.ts` trong `mosaic_web`. Viết ra 5 điều bạn hiểu về cách tổ chức.
