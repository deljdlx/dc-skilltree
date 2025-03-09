const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? 'index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            console.error('File not found:', filePath);
            res.end('404 Not Found');
        } else {
            console.log('Serving', filePath);
            res.end(data);
        }
    });
});

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});
