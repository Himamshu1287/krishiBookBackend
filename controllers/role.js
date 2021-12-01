const logger = require("../helper/logger");
// Add Role
exports.add = async (req, res) => {
  try {
    const role = await db.models.role.findOne({ role: req.body.role })
    if (role) {
      logger.error(msg.validation.roleExist);
      return res.status(409).json({ status: msg.status.error, message: msg.validation.roleExist })
    }
    const newRole = new db.models.role(req.body)
    newRole.save()
    return res.status(200).json({ success: msg.status.success, message: msg.successMessage.roleCreated })
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status: msg.status.error, message: err.message });
  }
}

// Delete Role
exports.delete = async (req, res) => {
  try {
    const role = await db.models.role.findOne({ role: req.body.role })
    if (!role) {
      logger.error(msg.errorMessage.invalidRole);
      return res.status(409).json({ status: msg.status.error, message: msg.errorMessage.invalidRole })
    }
    const user = await db.models.user.findOne({ role: role._id })
    if (user) {
      return res.status(409).json({ status: msg.status.error, message: msg.validation.roleExist })
    }
    db.models.role.deleteOne({ role: req.body.role }, async function (err, user) {
      if (err) {
        return res.status(401).json({ status: msg.status.error, message: err.message });
      }
      return res.status(200).json({ status: msg.status.success, message: msg.successMessage.roleDeleted });
    });
  }
  catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status: msg.status.error, message: err.message });
  }
}

// Update Role
exports.update = async (req, res) => {
  await db.models.role.findOneAndUpdate({ role: req.body.role }, { $set: { permissions: req.body.permissions } }, async function (err, data) {
    if (err) {
      logger.error(err.message);
      return res.status(401).json({ status: msg.status.error, message: err.message });
    }
    if (!data) {
      logger.error(msg.errorMessage.invalidRole);
      return res.status(400).json({ status: msg.status.error, message: msg.errorMessage.invalidRole })
    }
    return res.status(200).json({ status: msg.status.success, message: msg.successMessage.roleUpdated });
  });
}

// Role List
exports.list = async (req, res) => {

  try {
    await db.models.role.find((err, roleList) => {
      if (err) {
        logger.error(err.message);
        return res.status(401).json({ status: msg.status.error, message: err.message });
      }
      res.status(200).json({ status: msg.status.success, message: msg.successMessage.roleList, data: roleList })
    })
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({ status: msg.status.error, message: err.message })
  }
}
