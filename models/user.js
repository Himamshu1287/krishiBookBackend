 var validate = require('mongoose-validator');
 module.exports = function (mongoose) {
    let options = {
        collection: 'user',
        versionKey: false,
        timestamps: {
			createdAt: true,
			updatedAt: 'modifiedAt'
		}
    };
    var nameValidator = [
        validate({
          validator: 'isLength',
          arguments: [3, 20],
          message: msg.validation.nameValidate,
        })
    ]
    var mobileValidator= [
        validate({
            validator: 'isLength',
            arguments: [10,10],
            message: msg.validation.mobileValidate,
          })
     ]
    var emailValidator=[
        validate({
            validator: 'matches',
            arguments:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
            message:msg.validation.validEmail
        })
    ]
    const userSchema = new mongoose.Schema({
        role:{
            type: String,
            // enum: ['farmer', 'expert', 'buyer'],
            required:msg.validation.role
        },
        firstName: {
            type : String,
            required:msg.validation.firstName,
            validate: nameValidator

        },
        gender: {
            type : String,
            enum:['male','female','other']
        },
        lastName: {
            type : String,
            required:msg.validation.lastName,
            validate: nameValidator

        },
        email: {
            type: String,
            required:msg.validation.email,
            unique: true,
            validate: emailValidator
        },
        mobile: {
            type: String,
            required:msg.validation.mobile,
            validate: mobileValidator
        },
        password: {
            type: String,
            required:msg.validation.password,
        },
        isActive:{
            type:Boolean,
            default:true
        },
        profilePic:{
            type:String,
        },
        token: {
            type : String
        }
        
    }, options);
     return userSchema;
};


