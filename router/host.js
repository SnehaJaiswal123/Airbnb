const express = require('express');
const router = express.Router();
const hostController = require('../controllers/host')
const {upload} = require('../utils/multer')


router.get('/add-home',hostController.getAddHome)
router.post('/home-added', upload.single('photo_url'),hostController.postAddHome)
router.get('/edit-home/:homeId',hostController.getEditHome)
router.post('/edit-home',hostController.postEditHome)
router.post('/delete-home/:homeId',hostController.postDeleteHome)
router.get('/home-list',hostController.getHostHome)

module.exports = router;