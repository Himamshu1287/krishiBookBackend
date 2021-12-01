const md5 = require('md5');
exports.enterData = async () => {
  let adminRole = await db.models.role.findOne({role: 'admin'});
  const userRole = await db.models.role.findOne({role: 'user'});

  if(!adminRole) {
    const adminRole = new db.models.role({
      role: "admin",
      permissions: { modules: "All"}
    })
    await adminRole.save()
  }

  if(!userRole) {
    const userRole = new db.models.role({
      role: "user",
      permissions: {
        user: {
          detail: true,
          update: true,
          changePassword:true,
          delete: false,
        }
      },
    })
    await userRole.save()
  }

  adminRole = await db.models.role.findOne({role: 'admin'});
  const admin = await db.models.user.findOne({role: adminRole._id});
  
  if(!admin) {
    const admin = new db.models.user({
      "firstName": "Admin",
      "lastName": "Admin",
      "gender": "male",
      "email": "admin@gmail.com",
      "mobile": "9876543210",
      "password": md5("admin@123"),
      "role": adminRole._id,
      permissions: adminRole.permissions
    })
    await admin.save()
  }
}
