# Copilot Instructions

You MUST read and follow these rules before performing any task.

---

## 1. Theme chính của trang web

- Theme chủ đạo của app **được định nghĩa tại** thư mục theme `src/theme/*ts`
- Mọi màu sắc, font, spacing, style phải **bám sát** nội dung trong thư mục này
- **Không tự ý tạo theme mới** hoặc thêm style lớn không có trong thư mục này

---

## 2. Quy tắc về spacing (padding & margin)

- **Không sử dụng padding hoặc margin quá lớn** cho bất kỳ component nào

### ❌ Không được dùng

- `padding: 40px`, `padding: 50px` trở lên
- `margin: 40px`, `margin: 50px` trở lên
- Khoảng trắng quá lớn gây cảm giác UI bị “phình”

### ✅ Nên dùng

- Spacing nhỏ / vừa theo theme (ví dụ: 4px, 8px, 12px, 16px…)
- Giữ layout gọn, cân đối, nhất quán

---

## 3. Không sử dụng màu gradient

- **Tuyệt đối không dùng gradient** dưới bất kỳ hình thức nào:
  - `linear-gradient`
  - `radial-gradient`
  - background gradient
- Chỉ sử dụng **màu đơn sắc (flat color)** theo palette trong thư mục theme

---

## 4. Sử dụng SVG cho tất cả icon & emoji

- **Tất cả icon và emoji bắt buộc phải dùng SVG**
- SVG có thể là:
  - Inline SVG
  - SVG component (React / Vue / Svelte...)

### ❌ Không được phép

- Không dùng ký tự emoji trực tiếp trong text (🙂 ❤️ 🚀 …)
- Không dùng font-icon
- Không dùng PNG / JPG cho icon

### ✅ Ví dụ đúng

```html
<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
  <path d="..." />
</svg>
```

❌ Ví dụ sai

```html
<span>🙂</span>
```

## 5. Quy tắc khai báo TypeScript types

- **Bắt buộc sử dụng keyword `type`** cho tất cả các khai báo kiểu dữ liệu trong TypeScript.
- **Không được sử dụng `interface`** cho các type thông thường.
- Tên mỗi type phải bắt đầu bằng chữ cái "T" viết hoa.
- Tên mỗi interface phải bắt đầu bằng chữ cái "I" viết hoa.
- **Không được khai báo type tại chỗ**, phải khai báo type ở scope cao nhất của file.

### ✅ Ví dụ đúng

```ts
type TUser = {
  id: string
  name: string
  email: string
}
await fetchUser(): Promise<TUser> {
  // implementation
}
```

### ❌ Ví dụ sai

```ts
await fetchUser(): Promise<{
  id: string
  name: string
  email: string
}> {
  // implementation
}
```

### ✅ Trường hợp duy nhất được phép dùng `interface`

- Chỉ sử dụng `interface` khi khai báo **để một `class` implement**.

### ✅ Ví dụ đúng

```ts
type User = {
  id: string
  name: string
  email: string
}

type ApiResponse<T> = {
  data: T
  error?: string
}

interface Repository {
  save(data: unknown): void
}

class UserRepository implements Repository {
  save(data: unknown) {
    // implementation
  }
}
```

### ❌ Ví dụ sai

```ts
interface User {
  id: string
  name: string
}

interface ApiResponse<T> {
  data: T
}
```

## 6. Quy tắc về hàm

- Hàm phải được khai báo với tên cụ thể, **không được khai báo hàm mà không có tên**.
- **Hạn chế** khai báo hàm ngay trong trình lắng nghe sự kiện của component.

### ✅ Ví dụ đúng

```ts
function calculateTotal(amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0)
}
const fetchData = async (url: string): Promise<Response> => {
  return await fetch(url)
}

const todo = () => {
  console.log('123')
}
<Text onTouchStart={todo}>
  Touch me
</Text>
```

### ❌ Ví dụ sai

```ts
const calculateTotal = function (amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0)
}

<Text onTouchStart={() => {
  console.log("Touched")
}}>
  Touch me
</Text>
```
