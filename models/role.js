module.exports = function (mongoose) {
  let options = {
      collection: 'role',
      versionKey: false,
      timestamps: {
    createdAt: true,
    updatedAt: 'modifiedAt'
  }
  };
  const roleSchema = new mongoose.Schema({
      role:{
          type: String,
          required:msg.validation.role
      },
      permissions: {
        type: {}
      }
      
  }, options);
  

  return roleSchema;
};

