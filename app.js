const express= require('express');
const bodyParser = require('body-parser')
const path = require('path')
const hostRouter = require('./router/host');
const storeRouter = require('./router/store');
const authRouter = require('./router/auth');
const errorController = require('./controllers/errors');
const { default: mongoose } = require('mongoose');
const session = require('express-session')
const mongoSessionStore = require('connect-mongodb-session')(session)
const PORT=process.env.PORT || 3000
require('dotenv').config()

const app = express();

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))

const store = new mongoSessionStore({
  uri:process.env.DB_URL,
  collection:'sessions'
})

app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
  store
}))

app.use('/',(req,res,next)=>{
  req.isLoggedIn=req.session.isLoggedIn?true:false;
  console.log(req.isLoggedIn);
  console.log(req.session.user);
  
  next();
})

app.use('/host',(req,res,next)=>{
  if(!req.isLoggedIn){
    res.redirect('/login');
  }
  else next();
})

app.use('/host',hostRouter);
app.use(authRouter);
app.use(storeRouter);
app.use(errorController.pageNotFound);

mongoose.connect(process.env.DB_URL)
.then(()=>{
  console.log("Db connected");
  app.listen(PORT,()=>{
    console.log("App is running");
  })
})
.catch((err)=>{
  console.log("Error in connecting db:", err);
})
