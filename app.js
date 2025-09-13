const express= require('express');
const bodyParser = require('body-parser')
const hostROuter = require('./router/host');
const storeRouter = require('./router/store');
const authRouter = require('./router/auth');
const errorController = require('./controllers/errors');
const { default: mongoose } = require('mongoose');
const session = require('express-session')
const mongoSessionStore = require('connect-mongodb-session')(session)
const db_url = "mongodb+srv://snehajais270703_db_user:eyLybthyDhpNqohe@cluster0.fj7tm8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


const app = express();

app.set('view engine','ejs')
app.set('views','views')
app.use(bodyParser.urlencoded());

const store = new mongoSessionStore({
  uri:db_url,
  collection:'sessions'
})

app.use(session({
  secret:"123456789",
  resave:false,
  saveUninitialized:true,
  store
}))

app.use('/',(req,res,next)=>{
  req.isLoggedIn=req.session.isLoggedIn?true:false;
  next();
})

app.use('/host',(req,res,next)=>{
  if(!req.isLoggedIn){
    res.redirect('/login');
  }
  else next();
});

app.use('/host',hostROuter);
app.use(authRouter);
app.use(storeRouter);
app.use(errorController.pageNotFound);

mongoose.connect(db_url)
.then(()=>{
  console.log("Db connected");
  app.listen('3000',()=>{
    console.log("App is running");
  })
})
.catch((err)=>{
  console.log("Error in connecting db:", err);
})




// snehajais270703_db_user
// eyLybthyDhpNqohe

// "mongodb+srv://snehajais270703_db_user:<db_password>@cluster0.fj7tm8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"