const Home = require('../models/home')
const User = require('../models/user')

exports.getHostHome = (req,res)=>{
  const isLoggedIn=req.isLoggedIn
  const userId=req.session.user._id 
  const usertype=req.session.user.usertype  
  
  User.findById(userId).populate('homeList')
  .then((user)=>{    
    const homes=user.homeList;
    console.log("Host homes:",homes);
    
    res.render('host/host-home-list',{
      homes,
      pageTitle:'Air BnB',
      isLoggedIn,
      usertype
    })
  })
  .catch((err)=>{
    console.log("Error in getting host homes:",err);
  })
  
}

exports.getAddHome = (req,res,next)=>{
  const isLoggedIn=req.isLoggedIn
  const usertype=req.session.user.usertype 

  res.render('host/AddHome',{
    pageTitle:'Add Home to Air BnB',
    isLoggedIn,
    usertype
  })
}

exports.postAddHome  = (req,res,next)=>{
  const {houseName,price,location,rating,description} = req.body;
  const photo_url=`/temp/${req.file.filename}`
  
  const userId = req.session.user._id;
  const newHome = new Home({houseName,price,location,rating,description,photo_url})
  
  newHome.save()
    .then((home)=>{
      return User.findById(userId).then((user)=> {
        return {user,home}
      })
    })
    .then((result)=>{
      const {user,home} = result
      user.homeList.push(home._id);
      return user.save();
    })
    .then((user)=>{
      console.log("Home added to user",user);
      res.redirect('/host/home-list')  
    })
    .catch((err)=>{
      console.log("Error in adding home:",err);
      
    })

}

exports.getEditHome = (req,res,next)=>{
  const isLoggedIn=req.isLoggedIn
  const usertype=req.session.user.usertype 
  const homeId = req.params.homeId;

  Home.findById((homeId)).then((home)=>{
    res.render('host/editHome',{
      home,
      pageTitle:'Edit Home to Air BnB',
      isLoggedIn,
      usertype
    })
  })
}

exports.postEditHome  = (req,res,next)=>{
  const {_id,houseName,price,location,rating,description,photo_url} = req.body;  

  Home.findById(_id).then((home)=>{
    home.houseName=houseName,
    home.price=price,
    home.location=location,
    home.rating=rating,
    home.description=description,
    home.photo_url=photo_url
    home.save().then(()=>{
      console.log("Home updated ");
      res.redirect('/host/home-list')
    })
    .catch((err)=>{
      console.log("Error in saving home:",err);  
    })
  })
  .catch((err)=>{
    console.log("Error in fetching home:",err);  
  })
}

exports.postDeleteHome  = (req,res)=>{
  const homeId = req.params.homeId;
  console.log(homeId);
  
  Home.findByIdAndDelete(homeId)
  .then(()=>{
    console.log("Home deleted");
    return User.findById(req.session.user._id)
  })
  .then((user)=>{
    let indexToRemove = user.homeList.indexOf(homeId);
    if(indexToRemove!=-1) user.homeList.splice(indexToRemove, 1);
    return user.save()
  })
  .then((user)=>{
    console.log("Deleted from user",user);
    res.redirect('/host/home-list')
  })
  .catch((err)=>{
     console.log("Error in deleting home:",err);
  })
  
}


