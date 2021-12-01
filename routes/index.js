const userController = require("../controllers/user")
var express=require('express');
var router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
var upload = multer({ storage: storage });


router.post('/signup',upload.single('profilePic') ,userController.signup );
router.post('/signin',userController.signin);

module.exports=router;