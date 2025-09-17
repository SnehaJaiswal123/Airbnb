const session = require("express-session");
const { check, validationResult } = require("express-validator");
const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req,res) =>{
  const isLoggedIn=req.isLoggedIn
  if(isLoggedIn) res.redirect('/home');

  res.render('auth/login',{
    pageTitle:"Login",
    isLoggedIn,
    errors:[],
    oldEmail:""
  })
}

exports.postLogin =[
  check('email')
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Enter valid email"),

  check('password')
  .notEmpty()
  .withMessage("Password is required"),

  (req,res,next) =>{
  const {email,password} = req.body;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log("Error while logging in:", errors);      
      return res.status(422).render('auth/login',{
        pageTitle:"Login",
        isLoggedIn:false,
        errors:errors.array().map((err)=>err.msg),
        oldEmail:email
      })
  }

  User.findOne({email})
  .then((user)=>{
    if(!user){
      console.log("User doesn't Exist");
      return res.status(422).render('auth/login',{
        pageTitle:"Login",
        isLoggedIn:false,
        errors:["Email doesn't Exist"],
        oldEmail:email
      })
    }

    const hashPass = user.password;
    const passMatched = bcrypt.compareSync(password, hashPass);
    if(passMatched){
      req.session.isLoggedIn=true;
      req.session.user=user;
      res.redirect('/home')
    }
    else{
      return res.status(422).render('auth/login',{
        pageTitle:"Login",
        isLoggedIn:false,
        errors:["Incorrect Password"],
        oldEmail:email
      })
    }
  })
  .catch((err)=>{
    console.log("Error while logging in:", err);
  })
}]

exports.getSignup = (req,res,next) =>{
  const isLoggedIn=req.isLoggedIn
  if(isLoggedIn) res.redirect('/home');
  
  res.render('auth/signup',{
    pageTitle:"Signup",
    isLoggedIn,
    errors:[],
    oldInput:{
      firstName:"",
      lastName:"",
      email:"",
    }
  })
}

exports.postSignup = [
  check('firstName')
  .notEmpty()
  .withMessage("First Name is required")
  .trim()
  .isLength({min:2})
  .withMessage("First Name Length should be minimum 2")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("First Name can only contain letters"),

  check('lastName')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("Last Name can only contain letters"),

  check('email')
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Enter valid email"),

  check('password')
  .isLength({min:2})
  .withMessage('Password should be atleast 8 characters long')
  .matches(/[a-z]/)
  .withMessage("Password must contain atleast one lowercase letter")
  .matches(/[A-Z]/)
  .withMessage("Password must contain atleast one uppercase letter")
  .matches(/[0-9]/)
  .withMessage("Password must contain atleast one digit")
  .matches(/[!@#$&]/)
  .withMessage("Password must contain atleast one special character"),

  check('confirmPass')
  .custom((value,{req})=>{
    if(value!=req.body.password) throw new Error("Password doesn't match")
    return true;
  }),

  check('usertype')
  .notEmpty()
  .withMessage('Usertype is required')
  .isIn(['guest','host'])
  .withMessage('Enter valid user type'),
  
  (req,res,next) =>{
    const {firstName, lastName, email, password, confirmPass, usertype}=req.body;
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log("Error in signing up:", errors);      
      return res.status(422).render('auth/signup',{
        pageTitle:"Sign Up",
        isLoggedIn:false,
        errors:errors.array().map((err)=>err.msg),
        oldInput:{firstName, lastName, email}
      })
    }

    bcrypt.hash(password,12)
    .then((hashPass)=>{
      const newUser = new User({
        firstName, 
        lastName, 
        email, 
        password:hashPass, 
        usertype
      })
      return newUser.save()
    })
    .then(()=>{
      console.log("User signed up",req.body);
      res.redirect('/login')
    })
    .catch((err)=>{
      console.log("Error in signing up:",err);
      return res.status(422).render('auth/signup',{
        pageTitle:"Sign Up",
        isLoggedIn:false,
        errors:err.msg,
        oldInput:{firstName, lastName, email}
      })
    })
  }
]

exports.postLogout = (req,res,next) =>{
  req.session.destroy(()=>{
    console.log("Session destroyed");
    res.redirect('/login')
  })
}

