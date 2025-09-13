const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store')

router.get('/home',storeController.getHome)
// router.get('/bookings',storeController.getBookings)
router.get('/favourites',storeController.getFavourites)
router.get('/home/:homeId',storeController.getHomeDetails)
router.post('/favourites',storeController.postFavourites)
router.post('/remove-fav',storeController.removeFavourites)

module.exports = router;