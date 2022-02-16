const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate')
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Upload only image files!'), false)
    }
    cb(null, true);
};

const upload = multer({ storage: storage,
     fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.route('/')
// PREFLIGHT SETTINGS
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,
     (req, res, next) => {
    res.statusCode = 403;
    res.end('Get operation not supported on /imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
    upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
     (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
     (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /imageUpload');
})

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')

module.exports = uploadRouter;