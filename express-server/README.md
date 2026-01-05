# MoneyFlow Express Server

Server Express.js để nhận file SQLite database từ MoneyFlow app.

## Cài đặt

```bash
cd express-server
npm install
```

## Chạy server

### Development mode
```bash
npm run dev
```

### Production build
```bash
npm run build
npm start
```

## API Endpoints

### GET /
Kiểm tra trạng thái server

### POST /db-export/
Upload file database

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Field name: `file`
- File: SQLite database file (.db)

**Response:**
```json
{
  "success": true,
  "message": "Database file uploaded successfully",
  "file": {
    "name": "moneyflow.db",
    "size": 12345,
    "path": "/path/to/db/moneyflow.db",
    "timestamp": "2026-01-05T10:00:00.000Z"
  }
}
```

## Cấu hình

- Port: `8000`
- Database folder: `src/db/`
- File name: `moneyflow.db` (ghi đè tự động)

## Lưu ý

- Server lắng nghe trên `0.0.0.0` để có thể nhận request từ device khác trong cùng mạng LAN
- Mỗi lần upload sẽ tự động ghi đè file cũ
- File được lưu với tên cố định: `moneyflow.db`
