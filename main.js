// const http = require('http');
// const fs = require('fs');
//
// const hostname = '127.0.0.1';
// const port = 3000;
// const defaultFile = 'index.html';
//
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;    // request has succeeded
//     if (req.url === '/' || req.url === defaultFile) {
//         const defaultHtml = fs.readFileSync(`./client/${defaultFile}`);
//         res.write(defaultHtml);
//     }
//     else {
//         const filePath = `./client/${req.url.substring(1)}`;
//
//         fs.readFile(filePath, function(error, data){
//             if(error){
//                 res.statusCode = 404;
//                 res.end("Resource is not found!");
//             }
//             else{
//                 res.end(data);
//             }
//         });
//     }
//
// });
//
//
// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });
//

const fs = require('fs');
const http = require('http'); // 1 - Import Node.js core module
const path = require('path'); // 1 - Import Node.js core module

const port = 3000;
const directoryName = './client';
const root = path.normalize(path.resolve(directoryName));

const requestUrl = '/index.html';

let server = http.createServer(function (req, res) {   // 2 - creating server

    let file_path = root + (req.url ===  "/" ? requestUrl : req.url);
    let isScript = req.url.slice(-3) === ".js";

    fs.readFile(file_path, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404: File not found');
        } else {
            if(isScript) res.writeHead(200, { 'Content-Type' : 'application/javascript; charset=UTF-8' });
            else         res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

server.listen(port); //3 - listen for any incoming requests

console.log('Node.js web server at port ' + port + ' is running..')
