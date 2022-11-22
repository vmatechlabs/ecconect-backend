const yup = require('yup');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const constants = require('../config/constants');

module.exports.authLogin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({
        success: false,
        message: "ACCESS_DENIED_NOT_AUTHORIZED"
    })
    const accessToken = authHeader.split(' ')[1];
    try {
        if (!accessToken || accessToken === "undefined") return res.status(403).send({
            success: false,
            message: "AUTH_TOKEN_MISSING"
        })
        jwt.verify(accessToken, constants.auth.accessTokenSecret, (err, result) => {
            if (err) throw err;
            req.user = result;
            next();
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            type: false,
            message: "SOMETHING WENT WRONG",
            data: { error }
        })
    }
}

module.exports.checkAdmin = (req, res, next) => {
    this.authLogin(req, res, () => {
        if (req.user.user_role === "Admin") {
            next();
        }
        else {
            return res.status(403).send({
                success: true,
                message: "ACCESS_DENIED_NOT_AUTHORIZED"
            });
        }
    })
};

module.exports.uploadImage = async (req, res, next) => {
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/uploads");
        },
        filename: (req, file, cb) => {
            let ext = file.originalname.split('.')[1];
            let filename = file.originalname.split('.')[0];
            filename = filename.replace(/ /g, '')
            cb(null, `${filename}-${Date.now()}.${ext}`);
        },
    });

    multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        },
    }).then(() => {
        next();
    });
}