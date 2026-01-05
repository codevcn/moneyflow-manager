import cors from "cors"
import express, { Request, Response } from "express"
import fs from "fs"
import multer from "multer"
import path from "path"

const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json())

const dbDir = path.join(__dirname, "db")
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, dbDir)
  },
  filename: function (_req, _file, cb) {
    cb(null, "moneyflow.db")
  },
})

const upload = multer({
  storage: storage,
  fileFilter: function (_req, file, cb) {
    if (file.mimetype === "application/octet-stream" || file.originalname.endsWith(".db")) {
      cb(null, true)
    } else {
      cb(null, true)
    }
  },
})

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "MoneyFlow Database Server",
    status: "running",
    endpoints: {
      upload: "POST /db-export/",
    },
  })
})

app.post("/db-export/", upload.single("file"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    const filePath = path.join(dbDir, "moneyflow.db")
    const fileSize = req.file.size
    const timestamp = new Date().toISOString()

    console.log(`[${timestamp}] Database file received:`)
    console.log(`  - File: ${req.file.originalname}`)
    console.log(`  - Size: ${fileSize} bytes`)
    console.log(`  - Saved to: ${filePath}`)

    res.status(200).json({
      success: true,
      message: "Database file uploaded successfully",
      file: {
        name: "moneyflow.db",
        size: fileSize,
        path: filePath,
        timestamp: timestamp,
      },
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    res.status(500).json({
      success: false,
      message: "Failed to upload database file",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 MoneyFlow Database Server is running!`)
  console.log(`📡 Server URL: http://localhost:${PORT}`)
  console.log(`📁 Database folder: ${dbDir}`)
  console.log(`\n✅ Ready to receive database files at: POST /db-export/\n`)
})
