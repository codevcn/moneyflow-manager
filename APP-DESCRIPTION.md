# Comprehensive App Description

## Mô tả chi tiết về app

### App information

- Tên app: Money Flow Manager
- Mục đích: Quản lý dòng tiền cá nhân, theo dõi thu nhập và chi tiêu.
- Nền tảng: Mobile (Android)

### Core app objects

- Account (Tài khoản tài chính): Là tài khoản tài chính của người dùng, mỗi tài khoản sẽ có các giao dịch cho riêng tài khoản đó, mỗi account sẽ có các giao dịch và thống kê và settings riêng biệt.
- Transaction (giao dịch tài chính): Là một hành động tài chính, có thể là thu nhập hoặc chi tiêu.
- Account Settings (Cài đặt tài khoản): Chứa các thiết lập riêng cho từng account, như chế độ sáng/tối, loại tiền tệ, v.v (trước hết là có chế độ sáng/tối và loại tiền tệ VND).
- App Settings (Cài đặt app): Chứa các thiết lập chung cho toàn bộ app, như ngôn ngữ, v.v (trước hết là có ngôn ngữ tiếng Việt).

### Mô tả UI cho app

1. App có 1 menu drawer ở bên trái, có các mục sau:

- Trang chủ (mặc định khi mở app)
- Danh sách các account
- Cài đặt app
- Giới thiệu
- Thoát app

2. Tại màn hình chính của app sẽ có 2 tab chính: "Dòng tiền" và "Thống kê".

- Tab "Dòng tiền":
  - Hiển thị danh sách các giao dịch tài chính của người dùng theo ngày (từ ngày mới nhất đến ngày cũ hơn). Người dùng có thể chọn 1 giao dịch để xem chi tiết giao dịch đó, mỗi giao dịch sẽ chuyển đến màn hình chi tiết giao dịch, nơi hiển thị các thông tin sau:
    - Biểu đồ đường thể hiện các lần giao dịch trong ngày (kể cả nếu chỉ có 1 giao dịch trong ngày thì vẫn hiện biểu đồ đường).
    - Số tiền (hiển thị rõ ràng, nổi bật nhất)
    - Thời điểm giao dịch
    - Mô tả giao dịch
    - Danh mục
    - Loại giao dịch (Expense hoặc Income, hiển thị bằng màu sắc khác nhau: đỏ cho Expense, xanh cho Income)
  - Có 1 floating button ở góc dưới bên phải để người dùng thêm giao dịch mới. Khi nhấn vào button này, người dùng sẽ được chuyển đến màn hình thêm giao dịch mới, nơi họ có thể nhập thông tin về giao dịch. Màn hình thêm giao dịch mới sẽ có 2 màn hình con, 1 màn hình con cho Expense (mặc định) và 1 màn hình con cho Income. Người dùng có thể chuyển đổi giữa 2 màn hình con này bằng cách vuốt qua trái hoặc phải. Ở mỗi màn hình con, người dùng sẽ nhập các thông tin sau:
    - Số tiền (bắt buộc, có thể nhập giá trị số thực, phân tách phần nghìn bằng dấu phẩy, bàn phím số hiện lên khi người dùng nhấn vào ô nhập số tiền)
    - Ngày giao dịch (mặc định là ngày hiện tại, người dùng có thể chọn ngày khác)
    - Mô tả giao dịch (tùy chọn, làm theo dạng autosize textfield)
    - Danh mục (người dùng có thể chọn từ danh sách các danh mục có sẵn hoặc thêm danh mục mới)
    - Nút "Lưu" để lưu giao dịch mới và trở về màn hình chính của tab "Dòng tiền".
- Tab "Thống kê": Hiển thị danh sách các tháng trong năm (từ tháng mới nhất đến tháng cũ hơn), mặc định là tháng hiện tại, có thể chọn 1 tháng trong danh sách để chuyển đến màn hình chi tiết dòng tiền của tháng đó, nơi hiển thị các thông tin sau:
  - Biểu đồ tròn thể hiện tỷ lệ chi tiêu và thu nhập trong tháng.
  - Danh sách các giao dịch trong tháng, được phân loại theo ngày.
  - Tổng số tiền chi tiêu và thu nhập trong tháng.
  - Có 1 section để lọc giao dịch theo ngày (từ ngày X đến ngày Y).
  - 1 thanh tìm kiếm, có thể chọn loại tìm kiếm (có 1 nút clear để xóa nội dung tìm kiếm và reset lại danh sách giao dịch):
    - Tìm kiếm theo số tiền: nhập số tiền cần tìm kiếm, hiển thị các giao dịch có số tiền bằng với số tiền đã nhập.
    - Tìm kiếm theo mô tả: nhập từ khóa, hiển thị các giao dịch có mô tả chứa từ khóa đã nhập.
    - Tìm kiếm theo danh mục: chọn danh mục từ danh sách, hiển thị các giao dịch thuộc danh mục đã chọn.

3. Khi user sử dụng app lần đầu tiên, sẽ có 1 màn hình yêu cầu user tạo account đầu tiên, với các thông tin sau:

- Tên account (bắt buộc)
- Mô tả account (tùy chọn)
- Nút "Tạo account" để lưu account và chuyển đến màn hình chính của app.

4. Core concepts:

- App không cần đăng ký tài khoản, không cần đăng nhập, dữ liệu sẽ được lưu trữ cục bộ trên thiết bị của người dùng.
- Người dùng có thể tạo và lưu nhiều account khác nhau, mỗi account sẽ có dữ liệu giao dịch và thống kê riêng biệt.
- Mỗi Account không cần có số dư, app chỉ phục vụ việc quản lý và theo dõi các giao dịch, biết được dòng tiền ra vào, nên là không cần số dư.

### Các tính năng khác (ngoài luồng hoạt động chính)

- App password: Người dùng có thể thiết lập mật khẩu để bảo vệ dữ liệu trong app trong phần cài đặt app. Mật khẩu phải là mã PIN gồm 4 chữ số.
- Sao lưu và khôi phục dữ liệu: Người dùng có thể sao lưu dữ liệu giao dịch và account của mình ra 1 file json riêng. Người dùng cũng có thể khôi phục dữ liệu từ file json đã sao lưu trước đó.

### Các luồng thao tác của user trong app

1. Mở app lần đầu tiên -> tạo account đầu tiên -> chuyển đến màn hình chính của tab "Dòng tiền".
2. Mở app -> nhấn vào floating button -> chuyển đến màn hình thêm giao dịch mới (Mặc định là Expense) -> user nhập thông tin giao dịch -> nhấn nút "Lưu" -> trở về màn hình chính của tab "Dòng tiền".

## Các thuật ngữ trong app

- Tài khoản tài chính (Account): Là tài khoản tài chính của người dùng, mỗi tài khoản sẽ có các giao dịch cho riêng tài khoản đó.
- Giao dịch (Transaction): Là một hành động tài chính, có thể là thu nhập hoặc chi tiêu.
- Thống kê (Statistics): Là các số liệu và biểu đồ thể hiện tình hình tài chính của người dùng.
- Màn hình (Screen): Là các trang giao diện trong ứng dụng mà người dùng tương tác.
- Đường dẫn (Route): Là các liên kết để điều hướng giữa các màn hình trong ứng dụng.
- Cài đặt App (App Settings): Là các thiết lập và tùy chọn cho toàn bộ ứng dụng.
- Chi tiêu (Expense): Là loại giao dịch chi tiêu (tiền ra).
- Thu nhập (Income): Là loại giao dịch thu nhập (tiền vào).
- Số tiền (Amount): Số tiền của giao dịch.
- Danh mục (Category): Danh mục của giao dịch (ví dụ: Ăn uống, Mua sắm, Lương, v.v.).
- Thời điểm giao dịch (Transaction DateTime): Thời điểm thực hiện giao dịch gồm ngày và giờ.
- Mô tả (Description): Mô tả chi tiết về giao dịch.
- Chế độ sáng/tối (Light/Dark Mode): Tùy chọn giao diện sáng hoặc tối cho ứng dụng.
- Bảng màu chủ đạo (Primary Color Palette): Tập hợp các màu sắc chính được sử dụng trong giao diện ứng dụng.
- Font chữ chủ đạo (Primary Font): Font chữ chính được sử dụng trong ứng dụng.
- Tiền tệ (Currency): Loại tiền tệ được sử dụng trong ứng dụng (ví dụ: VND, USD, v.v.).

## Các màn hình có trong app

- Màn hình chính của app: Hiển thị màn hình của tab đang chọn và screen title.
- Màn hình chính của tab "Dòng tiền": Hiển thị danh sách các giao dịch theo ngày, có floating button để thêm giao dịch mới.
- Màn hình chi tiết giao dịch: Hiển thị thông tin chi tiết của một giao dịch cụ thể.
- Màn hình thêm giao dịch mới: Cho phép người dùng nhập thông tin về giao dịch mới.
- Màn hình chính của tab "Thống kê": Hiển thị danh sách các tháng trong năm với các số liệu thống kê tài chính.
- Màn hình chi tiết dòng tiền của tháng: Hiển thị biểu đồ và danh sách giao dịch trong tháng đã chọn.

## Yêu cầu về UI

- Giao diện tiện lợi, thân thiện, dễ sử dụng.
- Màu sắc phân biệt rõ ràng giữa các loại giao dịch (Expense và Income).
- Sử dụng biểu đồ trực quan để hiển thị số liệu thống kê.
- Các nút và trường nhập liệu rõ ràng, dễ nhận biết.
- Hỗ trợ chế độ sáng và tối để người dùng lựa chọn theo sở thích.
- Bảng màu chủ đạo: Xem chi tiết trong file `src/theme/colors.ts`, bao gồm:
  - Màu chính (Primary): `primaryBlue` - Xanh dương
  - Màu thành công/thu nhập (Success/Income): `green600` - Xanh lá
  - Màu lỗi/chi tiêu (Error/Expense): `red600` - Đỏ
  - Màu nền sáng: `white`, `slate50`, `slate200`
  - Màu nền tối: `slate900`, `slate600`
  - Màu chữ: `black` (chế độ sáng), `white` (chế độ tối)
- Font chữ chủ đạo: Inter.

## Yêu cầu về coding standards

- Src code phải có 1 thư mục riêng để chứa theme chủ đạo của app, bao gồm các màu sắc, font chữ, kích thước chữ, v.v.
- Src code phải có 1 thư mục riêng để chứa các hằng số (constants) dùng chung trong app, như định dạng ngày tháng, định dạng số tiền, v.v.
- Src code phải có 1 thư mục riêng để chứa các component tái sử dụng trong app, như button, textfield, card, v.v.
- Src code phải có các Entity Adapter riêng cho từng core app object (Account, Transaction, Account Settings, App Settings) để quản lý việc lưu trữ và truy xuất dữ liệu từ DB.
- Src code phải có 1 thư mục riêng để chứa các type định nghĩa các kiểu dữ liệu dùng trong app.
- Code phải dùng ES6+ trở lên, sử dụng cú pháp import/export.
- Code phải tuân theo nguyên tắc DRY (Don't Repeat Yourself) để tránh lặp lại mã nguồn.
- Code phải tuân thủ các nguyên tắc được định nghĩa trong file {root folder}/AI_AGENT_INSTRUCTIONS.md.
- App phải viết theo kiến trúc hướng đối tượng (OOP) cho logic code và viết theo kiến trúc component-based cho UI code.

## Yêu cầu về hiệu năng

- Ứng dụng phải hoạt động mượt mà, không bị lag khi chuyển đổi giữa các màn hình.
- Thời gian tải dữ liệu nhanh, không quá 3 giây khi mở ứng dụng và không vượt quá 2 giây khi chuyển đổi giữa các tab.
- Ứng dụng phải tối ưu hóa việc sử dụng bộ nhớ để tránh tình trạng ứng dụng bị đóng đột ngột do thiếu bộ nhớ.
