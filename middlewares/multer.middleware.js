const multer = require('multer')
const crypto = require('crypto');
const path = require('path')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/dps');
	},
	filename: function (req, file, cb) {
		crypto.randomBytes(13, function (err, buff) {
			const fn = buff.toString('hex') + path.extname(file.originalname);
			cb(null, fn);
		});
	},
});
const upload = multer({ storage: storage });


module.exports =upload