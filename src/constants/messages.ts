/**
 * App messages in Vietnamese
 */
export const MESSAGES = {
  // Validation messages
  VALIDATION: {
    REQUIRED_FIELD: "Trường này là bắt buộc",
    ACCOUNT_NAME_REQUIRED: "Tên tài khoản là bắt buộc",
    AMOUNT_REQUIRED: "Số tiền là bắt buộc",
    AMOUNT_POSITIVE: "Số tiền phải lớn hơn 0",
    INVALID_DATE: "Ngày không hợp lệ",
  },

  // Success messages
  SUCCESS: {
    ACCOUNT_CREATED: "Tạo tài khoản thành công",
    TRANSACTION_CREATED: "Thêm giao dịch thành công",
    TRANSACTION_UPDATED: "Cập nhật giao dịch thành công",
    TRANSACTION_DELETED: "Xóa giao dịch thành công",
    DATA_EXPORTED: "Xuất dữ liệu thành công",
    DATA_IMPORTED: "Nhập dữ liệu thành công",
  },

  // Error messages
  ERROR: {
    GENERIC: "Có lỗi xảy ra, vui lòng thử lại",
    DATABASE: "Lỗi cơ sở dữ liệu",
    CREATE_ACCOUNT_FAILED: "Tạo tài khoản thất bại",
    CREATE_TRANSACTION_FAILED: "Thêm giao dịch thất bại",
    LOAD_DATA_FAILED: "Tải dữ liệu thất bại",
  },

  // Onboarding
  ONBOARDING: {
    TITLE: "Chào mừng đến với Money Flow Manager",
    SUBTITLE: "Quản lý dòng tiền cá nhân dễ dàng",
    CREATE_FIRST_ACCOUNT: "Tạo tài khoản đầu tiên để bắt đầu",
    ACCOUNT_NAME_PLACEHOLDER: "Ví dụ: Tài khoản cá nhân",
    ACCOUNT_DESCRIPTION_PLACEHOLDER: "Mô tả tài khoản (không bắt buộc)",
    BUTTON_CREATE: "Tạo tài khoản",
  },

  // Common
  COMMON: {
    SAVE: "Lưu",
    CANCEL: "Hủy",
    DELETE: "Xóa",
    EDIT: "Sửa",
    CONFIRM: "Xác nhận",
    CLOSE: "Đóng",
    SEARCH: "Tìm kiếm",
    FILTER: "Lọc",
    CLEAR: "Xóa",
  },
} as const
