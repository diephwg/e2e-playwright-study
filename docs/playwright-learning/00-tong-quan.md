# Bài 00 — Tổng quan

## 1. Automation test là gì?

Test thủ công: người test mở trình duyệt, bấm, nhập, nhìn kết quả rồi ghi nhận đúng hay sai.

Automation test: viết code để máy làm đúng các bước đó, tự so sánh kết quả với mong đợi và báo pass/fail. Máy chạy nhanh hơn, không mệt, chạy lại được hàng trăm lần.

Automation phù hợp với:
- Test lặp đi lặp lại (regression) sau mỗi lần dev sửa code.
- Test cần chạy trên nhiều trình duyệt.
- Luồng quan trọng cần kiểm tra mỗi ngày (đăng nhập, thanh toán, tạo đơn).

Automation không thay thế hoàn toàn test thủ công. Test khám phá, test giao diện cảm tính, test tính năng mới còn thay đổi liên tục vẫn nên làm tay.

## 2. Playwright là gì?

Playwright là thư viện mã nguồn mở của Microsoft để điều khiển trình duyệt bằng code. Nó có sẵn bộ chạy test (`@playwright/test`).

Điểm mạnh:
- Chạy Chromium, Firefox, WebKit (Safari).
- Tự động chờ phần tử sẵn sàng (auto-wait), ít test chập chờn.
- Có công cụ đi kèm: `codegen` (ghi thao tác thành code), UI Mode, Trace Viewer (xem lại từng bước).
- Test được cả giao diện (UI) lẫn API.
- Hỗ trợ TypeScript, JavaScript, Python, Java, .NET. Tài liệu này dùng **TypeScript**, giống dự án `mosaic_web`.

## 3. Một test tự động gồm những gì?

Mọi test đều có 3 phần (mô hình **Arrange – Act – Assert**):

1. **Arrange** — chuẩn bị: mở trang, đăng nhập, tạo dữ liệu.
2. **Act** — hành động: bấm nút, nhập form.
3. **Assert** — kiểm tra: kết quả hiển thị có đúng mong đợi không.

Ví dụ ở dạng lời nói: "Mở trang todo → nhập 'Mua sữa' rồi Enter → kiểm tra danh sách có chữ 'Mua sữa'."

## 4. Lộ trình

```
Bài 01 Cài đặt ─► Bài 02 TypeScript ─► Bài 03 Test đầu tiên
        ─► Bài 04 Locator ─► Bài 05 Action/Assertion ─► Bài 06 Debug
        ─► Bài 07 Tổ chức test ─► Bài 08 Page Object ─► Bài 09 Nâng cao
```

Nếu bạn đã biết lập trình cơ bản, có thể lướt qua bài 02.

## 5. Từ vựng quan trọng

| Thuật ngữ | Nghĩa |
|-----------|-------|
| Test case | Một kịch bản kiểm tra cụ thể |
| Test suite / spec file | File chứa nhiều test case (`*.spec.ts`) |
| Assertion | Câu lệnh kiểm tra "kết quả phải như thế này" |
| Locator | Cách chỉ định một phần tử trên trang |
| Fixture | Thứ Playwright chuẩn bị sẵn cho test (ví dụ `page`) |
| Flaky test | Test lúc pass lúc fail dù code không đổi |
| Headless | Chạy trình duyệt không hiện cửa sổ |
| Regression | Lỗi cũ xuất hiện lại sau khi sửa code |
| CI | Hệ thống tự động chạy test mỗi khi có thay đổi code |

## Bài tập

1. Chọn một chức năng bạn hay test tay (ví dụ đăng nhập). Viết ra 5 bước và kết quả mong đợi theo Arrange – Act – Assert.
2. Ghi lại 3 loại test nào trong công việc của bạn nên automation, 3 loại nào nên để test tay. Giải thích ngắn.
