const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  houseName:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  location:{
    type:String,
    required:true
  },
  rating:{
    type:Number,
    required:true
  },
  description: String,
  photo_url:String,
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})

module.exports= mongoose.model('Home',homeSchema)

// const rootDir = require('../utils/path')
// const path = require('path')
// const fs= require('fs')


// exports.Home = class Home{
//   constructor(price,location, ratings){
//     this.price=price
//     this.location=location
//     this.ratings=ratings
//   }

//   save(){
//      const dataFilePath = path.join(rootDir,'data','home.json')
//      const randId=Math.floor(Math.random()*100000000+1);
//      this.id = randId;
//      Home.fetchAll((homes)=>{
//         homes.push(this);
//         fs.writeFile(dataFilePath,JSON.stringify(homes),(err)=>{
//         if(err) return err;
//         console.log("File written successfully");
//       })
//      })
     
//   }

//   static fetchAll(callback){
//     const dataFilePath = path.join(rootDir,'data','home.json')
//     fs.readFile(dataFilePath,(err,data)=>{
//       if(err){
//         console.log("Error in fetching file");
//         return callback([]);
//       }
//       const dataArr = JSON.parse(data);
//       callback(JSON.parse(data))
//     });
//   }

//   static fetchHomeById(homeId,callback){
//     const dataFilePath = path.join(rootDir,'data','home.json')
//     fs.readFile(dataFilePath,(err,data)=>{
//       if(err){
//         console.log("Error in fetching home");
//         return callback([]);
//       }
//       const homeArr = JSON.parse(data);
//       const myHome = homeArr.find((home)=> home.id == homeId)
//       console.log(myHome); 
//       callback(myHome)
//     });
//   }
// } 