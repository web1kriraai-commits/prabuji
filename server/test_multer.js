const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const http = require('http');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/test', upload.single('image'), (req, res) => {
    console.log('--- Request Received ---');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    res.json({ body: req.body, file: req.file });
});

const server = app.listen(0, () => {
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);

    // Test Case 1: Image as String (URL)
    const form1 = new FormData();
    form1.append('image', 'https://example.com/image.jpg');
    form1.append('title', 'Test Title');

    const req1 = http.request({
        host: 'localhost',
        port: port,
        path: '/test',
        method: 'POST',
        headers: form1.getHeaders()
    }, (res) => {
        res.on('data', (d) => process.stdout.write(d));
    });
    form1.pipe(req1);

    // Test Case 2: Image as File
    // We need a dummy file
    fs.writeFileSync('dummy.txt', 'dummy content');
    const form2 = new FormData();
    form2.append('image', fs.createReadStream('dummy.txt'));
    form2.append('title', 'Test Title File');

    setTimeout(() => {
        console.log('\n\n--- Test Case 2: File Upload ---');
        const req2 = http.request({
            host: 'localhost',
            port: port,
            path: '/test',
            method: 'POST',
            headers: form2.getHeaders()
        }, (res) => {
            res.on('data', (d) => {
                process.stdout.write(d);
                server.close();
                fs.unlinkSync('dummy.txt');
                // Cleanup uploads if created
            });
        });
        form2.pipe(req2);
    }, 1000);
});
