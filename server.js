const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Your MySQL username
    password: 'TUF08',  // Your MySQL password
    database: 'pdf_store'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('pdfFile');

function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}

// Upload PDF route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send(err);
        } else {
            if (req.file == undefined) {
                res.send('No file selected.');
            } else {
                const pdfName = req.file.filename;
                const pdfData = fs.readFileSync(path.join(__dirname, '/uploads/', req.file.filename));

                const query = "INSERT INTO pdf_files (name, pdf) VALUES (?, ?)";
                db.query(query, [pdfName, pdfData], (err, result) => {
                    if (err) throw err;
                    res.send('PDF file uploaded and stored in database !!!!.');
                });
            }
        }
    });
});

// Route to fetch and serve a PDF by its ID
app.get('/pdf/:id', (req, res) => {
    const pdfId = req.params.id;
    const query = "SELECT pdf, name FROM pdf_files WHERE id = ?";

    db.query(query, [pdfId], (err, result) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }

        if (result.length > 0) {
            const pdfData = result[0].pdf;
            const pdfName = result[0].name;

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${pdfName}"`);
            res.send(pdfData);
        } else {
            res.status(404).send('PDF not found');
        }
    });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'pdf.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
