//class for common function
var fs = require('fs');
let commonFunctions = class {
  /**constructor*/
  constructor() { }
  /**
   * This function is used for logs
   * @param {String} logName 
   */
  // fileLogs(logName) {
  //   fs.existsSync("./logs") || fs.mkdirSync("./logs");
  //   return require('simple-node-logger').createRollingFileLogger({
  //         logDirectory: 'logs',
  //         fileNamePattern: logName + '_<DATE>.log',
  //         dateFormat: 'YYYY_MM_DD',
  //         timestampFormat: 'YYYY-MM-DD HH:mm:ss'
  //   });
  // } 
  permissionCheck(module, route) {
    return async function (req, res, next) { 
      // fetch role data
      const data = await db.models.role.findOne({_id: req.role});
      const user = await db.models.user.findOne({_id: req.userId});
      if(data.role === 'admin') {
        next();
        // check if module is present
      } else if (user.permissions[module]) {
        // check if route is present 
        if (user.permissions[module][route]) {
          next();
        }else{
          return res.status(403).json({status:msg.status.error, message: msg.validation.access})
        }       
      }else{
        return res.status(403).json({status:msg.status.error, message: msg.validation.access})
      }
      
    }
  }     
};
module.exports = commonFunctions;