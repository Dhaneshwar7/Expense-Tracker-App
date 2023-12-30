
const cloudinary = require('../utils/cloudinary')
const upload = require('../middlewares/multer.middleware')


const uploadonCloudinary = async localFilePath => {
	try {
		if (!localFilePath) return null;
		// upload the on the Cloudinary
		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: 'image',
		});
		// file has been uploaded Successfully
		console.log('file upload Successfully', response.url);
		return response;
	} catch (error) {
		//REmover the Locally saved temporary file as the upload operation got failed
		fs.unlinkSync(localFilePath);
		return null;
	}
};

export{uploadonCloudinary}




function (req, res, next) {
	cloudinary.uploader.upload(req.file.path, function (err, result) {
		if (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				message: 'Eroor try agian',
			});
		}
		res.status(200).json({
			success: true,
			message: 'File uploaded',
			data: result,
		});
	});
}