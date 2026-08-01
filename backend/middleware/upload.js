const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads folder if it doesn't exist
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

// File filter
const fileFilter = (req, file, cb) => {

    console.log("========== FILE INFO ==========");
    console.log("Original Name :", file.originalname);
    console.log("Mime Type     :", file.mimetype);
    console.log("Extension     :", path.extname(file.originalname));
    console.log("===============================");

    const allowedExtensions = [".jpg", ".jpeg", ".png"];

    const extension = path.extname(file.originalname).toLowerCase();

    // Accept based on file extension
    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG and PNG files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

module.exports = upload;