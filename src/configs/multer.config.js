'use strict';

const multer = require('multer');

const uploadMemory = multer({
    storage: multer.memoryStorage(),
})

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => { 
            cb(null, './src/uploads/');
        },
        filename: (req, file, cb) => {
            const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
            cb(null, file.originalname + unique);
        }
    })
})

module.exports = {
    uploadMemory,
    uploadDisk
}