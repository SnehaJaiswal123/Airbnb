const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required:[true,'First Name is required']
  },
  lastName:String,
  email:{
    type:String,
    required:[true,'email is required']
  },
  password:{
    type:String,
    required:[true,'password is required']
  },
  usertype:{
    type:String,
    enum:['guest','host'],
    default:'guest'
  },
  favHomeIds:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Home'
  }],
  homeList:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Home'
  }]
})

const userModel = mongoose.model('User',userSchema)

module.exports = userModel