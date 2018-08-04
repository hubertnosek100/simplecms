const fileUpload = require('express-fileupload');

const fs = require('fs');


var uploader = function (app, userMiddleware) {
    app.use(fileUpload());

    app.get('/media', (req, res) => {
        var path = process.cwd();
        const folder = path + '/public/uploaded/';
        var files = fs.readdirSync(folder);
        res.json(files)
    });

    app.post('/upload', function (req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.sampleFile;
        var path = process.cwd();
        // Use the mv() method to place the file somewhere on your server
        if (sampleFile) {
            sampleFile.mv(path + '/public/uploaded/' + sampleFile.name, function (err) {
                return res.redirect('/simplecms/dashboard/media')
            });
        } else {
            res.redirect('/simplecms/dashboard/media')
        }
    });
};

module.exports = uploader;