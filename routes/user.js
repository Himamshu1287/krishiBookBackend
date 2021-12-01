const userController = require("../controllers/user")
var express = require('express');
var router = express.Router();

router.get('/detail',CommonFn.permissionCheck('user', 'detail'),userController.detail);
router.put('/update',CommonFn.permissionCheck('user', 'update'),userController.update);
// router.put('/update',userController.update);
router.delete('/delete',CommonFn.permissionCheck('user','delete'),userController.delete);
router.post('/logout',userController.logout);
router.post('/changePassword',CommonFn.permissionCheck('user', 'changePassword'),userController.changePassword);
router.post('/list',CommonFn.permissionCheck('user', 'list'),userController.list)
module.exports = router;    
