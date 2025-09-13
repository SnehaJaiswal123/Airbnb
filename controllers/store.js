const Home = require('../models/home')
const User = require('../models/user')


exports.getHome = (req,res,next)=>{
  const isLoggedIn=req.isLoggedIn      
  const usertype=req.session.user
  
  Home.find().then((homes)=>{   
      res.render('store/home-list',{
      homes,
      pageTitle:'Air BnB',
      isLoggedIn,
      usertype
    })
  }).catch((err)=>{
    console.log("Error in finding homes:",err);    
  })
}

exports.getHomeDetails = (req,res,next) =>{
  const isLoggedIn=req.isLoggedIn
  if(!isLoggedIn) return res.redirect('/login')

  const usertype=req.session.user.usertype 
  const homeId = req.params.homeId;

  Home.findById(homeId)
  .then((home)=>{
    res.render('store/home-detail',{
      home,
      pageTitle:'Air BnB',
      isLoggedIn,
      usertype
    })
  })  
}

exports.getFavourites = (req,res,next)=>{
  const isLoggedIn=req.isLoggedIn
  if(!isLoggedIn) return res.redirect('/login')

  const usertype=req.session.user.usertype 
  const userId = req.session.user._id

  User.findOne({_id:userId}).populate('favHomeIds')
  .then((favHomes)=>{
    const favouriteHomes = favHomes.favHomeIds;
    res.render('store/favourite-list',{
      favouriteHomes,
      pageTitle:'Favourite Homes',
      isLoggedIn,
      usertype
    })
  })
  .catch((err)=>{
    console.log("Error in getting fav",err);
  })

}

exports.postFavourites = (req,res,next) => {
  if(!req.isLoggedIn) return res.redirect('/login')  
  const homeId=req.body.homeId;
  const userId=req.session.user._id;
  
  User.findOne({_id:userId})
  .then((user)=>{   
    if(user.favHomeIds.includes(homeId)) console.log("Already in favourite")
    else{
      console.log("Fav added");
      user.favHomeIds.push(homeId);
      return user.save()
    }
  })
  .then((user)=>{
    res.redirect('/favourites')
  })
  .catch((err)=>console.log("Error in adding fav",err)
  )

}

exports.removeFavourites=(req,res,next)=>{
  if(!req.isLoggedIn) return res.redirect('/login')
  const homeId=req.body.homeId;
  const userId = req.session.user._id

  User.findById(userId)
  .then((user)=>{
    console.log(user);
    let indexToRemove = user.favHomeIds.indexOf(homeId);
    user.favHomeIds.splice(indexToRemove, 1);
    return user.save()
  })
  .then(()=>{
    console.log("Fav deleted"); 
    res.redirect('/favourites')
  })
  .catch((err)=>console.log("Error in removing fav",err)
  )

}

exports.getBookings = (req,res,next)=>{
  const isLoggedIn=req.isLoggedIn
  if(!isLoggedIn) return res.redirect('/login')

  Home.fetchAll((homes)=>{
    console.log(homes);
    res.render('store/bookings',{
      homes,
      pageTitle:'Air BnB'
    })
  })  
}