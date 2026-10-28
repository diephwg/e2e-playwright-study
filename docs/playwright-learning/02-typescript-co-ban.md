# Bài 02 — TypeScript tối thiểu để viết test

Bạn không cần giỏi lập trình để bắt đầu. Chỉ cần nắm các phần dưới đây. Thử chạy ví dụ bằng cách tạo file `thu.ts` rồi chạy `npx tsx thu.ts` (cài bằng `npm i -D tsx`), hoặc dán vào https://www.typescriptlang.org/play.

## 1. Biến

```ts
const ten = 'Lan';        // không đổi được (ưu tiên dùng)
let tuoi = 25;            // đổi được
tuoi = 26;

const dangNhap = true;    // boolean
const ds = ['a', 'b'];    // mảng
const user = { name: 'Lan', age: 25 };  // object
console.log(user.name);
```

Quy tắc: dùng `const` mặc định, chỉ dùng `let` khi cần gán lại.

## 2. Kiểu dữ liệu (TypeScript khác JavaScript ở đây)

```ts
const ten: string = 'Lan';
const tuoi: number = 25;
const ok: boolean = true;
const ds: string[] = ['a', 'b'];
```

TypeScript thường tự suy ra kiểu, nên không phải lúc nào cũng viết. Khi viết sai kiểu, VS Code gạch đỏ ngay.

## 3. Chuỗi và template string

```ts
const ten = 'Lan';
console.log(`Xin chào ${ten}`);   // dùng dấu backtick
```

Dùng nhiều trong test để ghép dữ liệu ngẫu nhiên: `` `user_${Date.now()}@mail.com` ``.

## 4. Hàm

```ts
function cong(a: number, b: number): number {
  return a + b;
}

const nhan = (a: number, b: number) => a * b;   // arrow function
```

Arrow function `() => {}` xuất hiện khắp nơi trong Playwright.

## 5. Điều kiện và vòng lặp

```ts
if (tuoi >= 18) {
  console.log('người lớn');
} else {
  console.log('trẻ em');
}

for (const item of ['a', 'b', 'c']) {
  console.log(item);
}
```

So sánh dùng `===` (bằng) và `!==` (khác). Tránh `==`.

## 6. Mảng và object hay dùng

```ts
const so = [1, 2, 3];
so.push(4);
so.length;                       // 4
so.map((x) => x * 2);            // [2,4,6,8]
so.filter((x) => x > 2);         // [3,4]
so.includes(3);                  // true

const { name, age } = user;      // destructuring: lấy thuộc tính ra biến
```

Destructuring chính là dạng `async ({ page }) => {}` bạn sẽ thấy ở mọi test.

## 7. Async / await — quan trọng nhất

Thao tác với trình duyệt cần thời gian (tải trang, chờ phần tử). Các hàm này trả về `Promise`. Bạn phải dùng `await` để đợi chúng xong.

```ts
async function chay() {
  await page.goto('https://playwright.dev');   // đợi tải xong
  await page.click('text=Docs');               // đợi click xong
}
```

Quy tắc vàng:
- Hàm có dùng `await` phải khai báo `async`.
- **Quên `await` là lỗi phổ biến nhất của người mới.** Test sẽ chạy sai thứ tự hoặc pass giả. Hầu hết lệnh Playwright cần `await`.
- Riêng khai báo locator (`page.getByRole(...)`) không cần `await`, vì chỉ mô tả chứ chưa thao tác.

## 8. Import / export

```ts
// file utils.ts
export function taoEmail() {
  return `user_${Date.now()}@mail.com`;
}

// file khác
import { taoEmail } from './utils';
```

Dự án `mosaic_web` dùng cách này để chia sẻ page object và helper (`utils/`, `pages/`).

## 9. Class (dùng ở bài Page Object Model)

```ts
class MayTinh {
  constructor(private ten: string) {}

  gioiThieu() {
    return `Tôi là ${this.ten}`;
  }
}

const m = new MayTinh('Lan');
m.gioiThieu();
```

Chỉ cần hiểu: class gom dữ liệu và hàm liên quan vào một khối, tạo ra bằng `new`.

## 10. Đọc lỗi

Khi lỗi xuất hiện, đọc theo thứ tự:
1. Dòng đầu: loại lỗi và mô tả (`Error: expect(locator).toBeVisible()`).
2. Dòng có đường dẫn file và số dòng: `at tests/abc.spec.ts:12`.
3. Phần `Call log` của Playwright: ghi lại nó đã thử làm gì và chờ gì.

## Bài tập

1. Viết hàm `tinhTong(ds: number[]): number` cộng mọi số trong mảng.
2. Viết hàm `taoEmail(): string` trả về email dạng `test_<timestamp>@mail.com`.
3. Cho mảng `['Mua sữa', 'Học Playwright', 'Đi chợ', 'nấu cơm tối nay']`, in ra những phần tử dài hơn 8 ký tự bằng `filter`.
4. Giải thích bằng lời: vì sao đoạn sau sai?
   ```ts
   function mo() {
     await page.goto('https://playwright.dev');
   }
   ```
   (Gợi ý: thiếu `async`.)

Tài liệu thêm: https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html
