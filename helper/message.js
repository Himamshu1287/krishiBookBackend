module.exports = {
    successMessage: {        
        create: "User created successfully",
        login: "User loggedIn successfully",
        update: "user updated successfully",
        delete: "user deleted successfully",
        logout: "user logout successfully",
        detail: "user found successfully",
        Changepassword: "Password changed Successfully.",
        roleCreated: "Role created successfully",
        roleDeleted: "Role deleted successfully",
        roleUpdated: "Role updated successfully",
        roleList: "Role list fetched",
        userList: "User list fetched"
    },
    nodemailer: {
        emailSubject: "user registration",
        welcomeMessage: "Welcome to nodeProject",
    },
    errorMessage: {
        invalidRole: "role does not exist",
        wrongCredantial: "Incorrect email or password.",
        notFound: "User Not Found",
        tokenFailed: "Invalid token",
        requiredToken:"A token is required for authentication",
        Invalid: "Invalid user.",
        WrongPassword: "Incorrect old password",
        PasswordTaken: "password already exist",
        emailTaken: "Email Already Taken",        
    },
    validation: {
        role:'role is required',
        firstName: 'firstName is required',
        lastName: 'lastName is required',
        nameValidate: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
        mobileValidate:'mobile should of {ARGS[1]} digits',
        email: 'email is required',
        mobile: 'mobile is required',
        password: 'password is required',
        validEmail: 'Please fill a valid email address',
        mobileValidation: "must be 10 degits",
        roleExist: "role already exists",
        access: "Access Denied"
    },
    status: {
        success: "OK",
        error: "ERROR",
    },
}