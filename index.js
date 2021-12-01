// message declare global
global.msg = require('./helper/message');
//global db declare
global.db = require('./models');
//global templete declare
global.__basedir = __dirname;
//load redis class in global variable
const redisConnection = require('./helper/redis');
global.redis = new redisConnection();
require('dotenv').config();
//load common functions
const commonFunction = require("./helper/functions");
global.CommonFn = new commonFunction();
const logger = require("./helper/logger");
//express declaration
const express = require("express");
const app = express();
var fs = require('fs');
var path = require('path');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
//http server declaration
var http = require('http').Server(app);
//package declaration
var bodyParser = require('body-parser');
var cors = require('cors');
//morgan declaration
const morgan = require('morgan');
//swagger declaration
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
const basicAuth = require('express-basic-auth');
//token delare
var  auth   = require("./helper/auth");
//routes path
const userRouter = require("./routes/user");
const roleRouter = require("./routes/role");
const  indexRouter = require("./routes/index");
//bodyparser declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cors());
//Serves resources from public folder
app.use(express.static(__dirname + 'public')); 
//server port declaration
const PORT = process.env.PORT
//swagger password
const swagger_password = process.env.SWAGGER_PASSWORD;
//morgan logger
app.use(morgan(':method :url :status :response-time ms - :res[content-length]',{ stream: accessLogStream }))
// enterData()
//swagger api
app.use('/api-docs',swaggerUi.serve,basicAuth({
   users: { Admin: swagger_password },
   challenge: true,
 }),  swaggerUi.setup(swaggerDocument));
//before login api path
app.use("/api/",indexRouter);
 //JWT token varifucation
app.use(auth.verifyAuthToken);
//after login api path
app.use("/api/role", roleRouter);
app.use("/api/user", userRouter); 
//server listen 
http.listen(PORT, (req, res) => {
   logger.info(`app is listening to PORT ${PORT}`)
});
     

   