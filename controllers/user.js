const { getAccessToken } = require("../helper/auth");
var md5 = require('md5');
require('dotenv').config();
const { nodeMailerService } = require("../helper/nodemailer");
const logger = require("../helper/logger");

// user singup
exports.signup = async (req, res) => {
  try {
    let userData = await db.models.user.findOne({ email: req.body.email}); 
    if (userData) {
      logger.error(msg.errorMessage.emailTaken);
      return res.status(401).json({ status: msg.status.error,message: msg.errorMessage.emailTaken });
    }
    // req.body.profilePic = req.file.path;
    req.body.gender = req.body.gender.toLowerCase();
    req.body.password = md5(req.body.password);
    var newUser = new db.models.user(req.body);
    newUser.save(async function (err, newUserData) {
      if (err) {
        logger.error(err.message);
        return res.status(401).json({ status:msg.status.error,message: err.message });
      }
      await redis.hmset('allUsers:' + newUserData._id, {
        firstName: newUserData.firstName,
        lastName:newUserData.lastName,
        role: newUserData.role,
        gender:newUserData.gender,
        mobile: newUserData.mobile,
        email: newUserData.email,
        createdAt: newUserData.createdAt,
        isActive: true
      });
      nodeMailerService(req.body.email,msg.nodemailer.emailSubject,msg.nodemailer.welcomeMessage);
      return res.status(200).json({ status:msg.status.success, message: msg.successMessage.create});
    });
  
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status:msg.status.error, message: err.message });
  }
}


// user signin
exports.signin = async (req, res) => {
  try {
    let userData = await db.models.user.findOne({ email: req.body.email, password: md5(req.body.password)});
      if (!userData) {
        logger.error(msg.errorMessage.wrongCredantial);
        return res.status(401).json({ status:msg.status.error, message: msg.errorMessage.wrongCredantial });
      }
      userData.token = getAccessToken(userData._id);
      userData.save();
      return res.status(200).json({ status:msg.status.success, message: msg.successMessage.login, data: userData.token });
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status:msg.status.error, message: err.message });
  }
}
// user details
exports.detail = async (req, res) => {
  try {
     let data = await db.models.user.findOne({_id: req.userId});
      if (!data) {
        logger.error(msg.userNotFound);
        return res.status(404).json({ status:msg.status.error, message: msg.errorMessage.notFound })
      }
      await redis.hgetall('allUsers:' + req.userId.toString());
      return res.status(200).json({ status:msg.status.success,message:msg.successMessage.detail,data: data });
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status:msg.status.error, message: err.message });
  }
}
//user update
exports.update = async (req, res) => {
  try {
    const data = await db.models.role.findOne({_id: req.role})
    let id = req.userId
    if (data.role === "admin") {
      if(req.body.userId){
        id = req.body.userId
      }      
    } else {
      await delete req.body["permissions"];
    }
    req.body.gender = req.body.gender.toLowerCase()
    db.models.user.findOneAndUpdate({ _id:id }, { $set: req.body }, async function (err, data) {
      if (err) {
        logger.error(err.message);
        return res.status(400).json({ status:msg.status.error, message: err.message });
      }
      if (!data) {
        logger.error(msg.errorMessage.notFound);
        return res.status(404).json({ status:msg.status.error, message: msg.errorMessage.notFound })
      }
      await redis.hmset('allUsers:' + req.userId.toString(), req.body);
      return res.status(200).json({ status:msg.status.success, message: msg.successMessage.update});
    });
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status:msg.status.error, message: err.message });
  }
}
//user delete
exports.delete = async (req, res) => {
  try {
    let data = await db.models.user.findOneAndDelete({ _id: req.userId  });
      if (!data) {
        logger.error(msg.errorMessage.notFound);
        return res.satus(404).json({ status:msg.status.error,message: msg.errorMessage.notFound })
      }
      await redis.del('allUsers:' + req.userId.toString());
      return res.status(200).json({ status:msg.status.success,message: msg.successMessage.delete});
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status:msg.status.error,message: err.message });
  }
}
// logout api
exports.logout = async(req, res) => {
  try {
    let user = await db.models.user.findOneAndUpdate({ _id: req.userId }, { $set: { token: '' } });
      return res.status(200).json({ status:msg.status.success, message: msg.successMessage.logout});
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status:msg.status.error, message: err.message });
  }
}

// changePassword api
exports.changePassword = async(req, res) => {
  try {
    let userData = await db.models.user.findOne({ _id: req.userId });
      if (!userData) {
        logger.error(msg.errorMessage.notFound);
        return res.status(404).json({ status:msg.status.error, message:msg.errorMessage.notFound});
      }
      if (userData.password != md5(req.body.oldPassword)) {
        logger.error(msg.errorMessage.WrongPassword);
        return res.status(400).json({ status:msg.status.error, message:msg.errorMessage.WrongPassword});
      }
      if (req.body.oldPassword == req.body.newPassword) {
        logger.error(msg.errorMessage.PasswordTaken);
        return res.status(409).json({ status:msg.status.error, message:msg.errorMessage.PasswordTaken});
      }
      userData.password = md5(req.body.newPassword);
      userData.save();
      return res.status(200).json({ status:msg.status.success,message:msg.successMessage.Changepassword});
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status:msg.status.error, message: err.message });
  }
}

// list Api

exports.list = async (req, res) => {
  try {
    var page = (req.body.page) ? req.body.page : 1;
		var limit = parseInt(process.env.PAGE_LIMIT);
		var skip = (page * limit) - limit;
		var query = { $and: [] };
		var subQuery = { $or: [] };
    if(req.body.search){
      subQuery["$or"].push({ "firstName": { "$regex": req.body.search, "$options": "i" } });
			subQuery["$or"].push({ "lastName": { "$regex": req.body.search, "$options": "i" } });
      subQuery["$or"].push({ "email": { "$regex": req.body.search, "$options": "i" } });
      subQuery["$or"].push({ "mobile": { "$regex": req.body.search, "$options": "i" } });
      subQuery["$or"].push({ "gender": { "$regex": req.body.search, "$options": "i" } });
    }
    //if (req.body.status == "active") {
			query["$and"].push({ "isActive": true });
		//}
    if (typeof subQuery !== 'undefined' && Object.keys(subQuery).length > 0 && subQuery["$or"].length > 0) {
			query["$and"].push(subQuery);
		}
    let totalRecords = await db.models.user.countDocuments(query);
    db.models.user.find(query)
    .sort('createdAt')
    .skip(skip)
    .limit(limit)
    .select({"token":0,"password":0})
    .exec(function (err, userList) {
      if (err) {
        logger.error(err.message);
        return res.status(401).json({ status:msg.status.error, message: err.message });
      }
      res.status(200).json({status:msg.status.success, message:msg.successMessage.userList, data: userList , totalRecords})
    })
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status:msg.status.error, message: err.message })
  }
}
