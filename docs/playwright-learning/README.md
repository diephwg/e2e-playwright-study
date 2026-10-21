# Học Test Automation với Playwright — từ con số 0

Bộ tài liệu này dành cho người chưa biết gì về lập trình hay automation test. Học theo thứ tự từ bài 00 đến bài 09. Mỗi bài có phần giải thích, ví dụ, và bài tập cuối bài.

## Mục lục

| Bài | Nội dung | Thời gian gợi ý |
|-----|----------|-----------------|
| [00](00-tong-quan.md) | Automation test là gì, Playwright là gì, lộ trình | 30 phút |
| [01](01-cai-dat.md) | Cài Node.js, VS Code, tạo project, chạy test đầu tiên | 1-2 giờ |
| [02](02-typescript-co-ban.md) | TypeScript/JavaScript tối thiểu cần biết | 3-5 ngày |
| [03](03-test-dau-tien.md) | Cấu trúc một test, `page`, `goto`, `expect` | 1 ngày |
| [04](04-locator.md) | Tìm phần tử trên trang (locator) | 2 ngày |
| [05](05-action-va-assertion.md) | Thao tác (click, nhập, chọn) và kiểm tra kết quả | 2 ngày |
| [06](06-auto-wait-va-debug.md) | Auto-wait, debug, trace viewer, codegen | 2 ngày |
| [07](07-to-chuc-test.md) | `describe`, hook, fixture, tag, config | 2 ngày |
| [08](08-page-object-model.md) | Page Object Model, login một lần (`storageState`) | 3 ngày |
| [09](09-nang-cao-va-du-an-that.md) | API testing, CI, đọc code dự án `mosaic_web` | 3-5 ngày |
| [Cheatsheet](cheatsheet.md) | Bảng tra nhanh lệnh và cú pháp | — |

## Cách học hiệu quả

1. Gõ lại ví dụ bằng tay. Không copy-paste.
2. Làm bài tập cuối mỗi bài trước khi sang bài sau.
3. Khi test fail, đọc thông báo lỗi trước khi hỏi. Đa số lỗi nằm ngay trong thông báo.
4. Mỗi ngày học 1-2 giờ đều đặn tốt hơn học 8 giờ một ngày rồi nghỉ cả tuần.

## Trang luyện tập công khai

Các bài tập dùng trang demo công khai, không cần tài khoản:

- https://demo.playwright.dev/todomvc — ứng dụng todo, phù hợp để học locator và assertion.
- https://playwright.dev — tài liệu chính thức, có ô tìm kiếm và menu.
- https://the-internet.herokuapp.com — nhiều trang nhỏ cho từng loại control (checkbox, dropdown, upload, alert...).

## Tài liệu chính thức

- https://playwright.dev/docs/intro
- https://playwright.dev/docs/locators
- https://playwright.dev/docs/test-assertions
- https://playwright.dev/docs/best-practices
