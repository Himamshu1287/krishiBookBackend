const roleController = require("../controllers/role")
var express = require('express');
var router = express.Router();

router.post('/add', CommonFn.permissionCheck('role', 'add'),roleController.add);
router.delete('/delete', CommonFn.permissionCheck('role', 'delete'),roleController.delete);
// router.put('/update',  CommonFn.permissionCheck('role', 'update'),roleController.update);
router.get('/list', CommonFn.permissionCheck('role', 'update'), roleController.list);

module.exports = router;    
