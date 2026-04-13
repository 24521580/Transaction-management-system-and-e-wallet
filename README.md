# Transaction Management System and E-Wallet

Website quản lý giao dịch + ví điện tử (React + Vite + TypeScript) theo phong cách UI iOS-inspired (định hướng iOS 26 trong đề bài).

## Tech stack

- React + Vite + TypeScript
- TailwindCSS
- Framer Motion
- React Router
- Recharts
- Zustand
- Axios
- React Hook Form + Zod

## Tính năng chính

- Landing page + CTA đăng nhập/đăng ký
- Auth: Đăng nhập / Đăng ký / Quên mật khẩu
- Dashboard: số dư ví, tổng thu/chi tháng, biểu đồ, giao dịch gần đây
- Transactions: lọc theo ngày/loại/danh mục/số tiền, tìm kiếm, phân trang, thêm/sửa/xóa
- Wallet: nạp/rút/chuyển tiền, lịch sử biến động số dư
- Categories/Budgets: quản lý danh mục thu/chi, ngân sách tháng, cảnh báo >80% và >100%
- Reports: biểu đồ tròn theo danh mục, biểu đồ cột theo tháng, export CSV
- Profile/Settings: thông tin cá nhân, đổi mật khẩu, bật/tắt dark mode
- Route guards cho khu vực yêu cầu đăng nhập

## Theme iOS 26

Design token chính được cấu hình trong `tailwind.config.ts`:

- Primary: `#007AFF`
- Success: `#34C759`
- Warning: `#FF9F0A`
- Danger: `#FF3B30`
- Background: `#F2F2F7`

Ngoài ra có glassmorphism, bo góc lớn, shadow mềm, button pill 44px, transition 250ms, focus ring rõ ràng.

## Cấu trúc thư mục

```text
src/
  pages/
  components/
    ui/
    common/
  features/
    auth/
    transactions/
    settings/
  services/
    api/
  store/
  types/
  utils/
```

## Mock data và nghiệp vụ

- Dữ liệu demo nằm trong Zustand store (`src/store/useAppStore.ts`)
- Transaction model:
  - `id, title, amount, type(income|expense|transfer), category, date, note, walletId`
- Dashboard tính:
  - tổng thu, tổng chi, chênh lệch
  - top 5 danh mục chi tiêu
- Budget usage:
  - `% đã dùng = totalExpenseByCategory / budgetLimit * 100`
  - Cảnh báo vàng khi > 80%
  - Cảnh báo đỏ khi > 100%
- Service layer Axios dùng mock adapter (`src/services/api/mockAdapter.ts`) để mô phỏng API call khi chưa có backend thật.

## Cài đặt và chạy local

```bash
npm install
npm run dev
```

## Deploy public bằng Vercel

1. Push code của repo này lên GitHub.
2. Đăng nhập Vercel và chọn **Add New... > Project**.
3. Import repository `Transaction-management-system-and-e-wallet`.
4. Vercel sẽ tự nhận diện Vite, kiểm tra lại:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Bấm **Deploy** để nhận URL public dạng `https://<project>.vercel.app`.
6. Nếu dùng API/backend thật sau này, thêm biến môi trường tại:
   - **Project Settings > Environment Variables**
   - Sau đó redeploy project.
7. (Tuỳ chọn) gắn domain riêng tại **Project Settings > Domains**.

Build production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Accessibility và responsive

- Có `aria-label` cho các action quan trọng
- Điều hướng bằng bàn phím trên form controls/buttons
- Responsive cho desktop/tablet/mobile (header + bottom nav)

## Hướng mở rộng tích hợp backend thật

1. Thay `mockAdapter` bằng API thật qua `apiClient` (baseURL từ `.env`).
2. Chuẩn hóa auth với JWT + refresh token.
3. Đồng bộ model giữa frontend/backend bằng OpenAPI hoặc schema shared.
4. Chuyển mock state actions sang React Query hoặc RTK Query để cache server state.
5. Thêm phân quyền, audit log, và test E2E cho luồng giao dịch quan trọng.
