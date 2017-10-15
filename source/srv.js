((function () {
    "use strict";
    var  http = require('http'),
        url = require('url'),
        fs = require('fs'),
        path = require('path'),
        // you can pass the parameter in the command line. e.g. node static_server.js 3000
        //
        port = process.argv[2] || $settings.server.port$,
        ext;



    http.createServer(function (req, res) {
        // console.log(`${req.method} ${req.url}`);
        // parse URL
        var parsedUrl = url.parse(req.url),
            // extract URL path
            pathname = `.${parsedUrl.pathname}`,
            // maps file extention to MIME types
            mimeType = {
                ".ico": "image/x-icon",
                ".html": "text/html",
                ".js": "text/javascript",
                ".json": "application/json",
                ".css": "text/css",
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".wav": "audio/wav",
                ".mp3": "audio/mpeg",
                ".svg": "image/svg+xml",
                ".pdf": "application/pdf",
                ".doc": "application/msword",
                ".eot": "appliaction/vnd.ms-fontobject",
                ".ttf": "aplication/font-sfnt"
            };
        fs.exists(pathname, function (exist) {
            if(!exist) {
                // if the file is not found, return 404
                res.statusCode = 404;
                res.end(`File ${pathname} not found!`);
                return;
            }
            // if is a directory, then look for index.html
            if (fs.statSync(pathname).isDirectory()) {
                pathname += "/index.html";
            }
            // read file from file system
            fs.readFile(pathname, function(err, data){
            if(err){
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                ext = path.parse(pathname).ext;
                // if the file is found, set Content-type and send data
                res.setHeader("Content-type", mimeType[ext] || "text/plain" );
                res.end(data);
            }
            });
        });
    }).listen(parseInt(port));
    console.log(`Server listening on port ${port} http:\/\/localhost:${port}`);
}));