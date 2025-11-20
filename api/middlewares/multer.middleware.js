import multer from 'multer'

const storage= multer.diskStorage({
	filename: function (req, file, cd) {
		cd(null, file.originalname)
	},
	destination: function (req, file, cb) {
		cb(null, './public/uploads');  // where store data },
	},
})


export const upload = multer({storage})
