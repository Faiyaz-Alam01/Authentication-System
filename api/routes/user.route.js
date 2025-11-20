import {Router} from 'express'
import { authWithGoogle, changeCurrentPassword, currentUser, logoutUser, updateAccountDetails, userLogin, userRegister } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

router.route('/register').post(upload.single("avatar"),userRegister);
router.route('/login').post(userLogin);
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/change-password').post(verifyJWT,changeCurrentPassword)
router.route('/current-user').get(verifyJWT,currentUser)
router.route('/update-user').patch(upload.single('avatar'),verifyJWT ,updateAccountDetails)

router.route('/google-login').post(upload.single('avatar') ,authWithGoogle)



export default router