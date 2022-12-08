const express=require('express');
const authAd = require('../middleware/authAd');
const router=new express.Router()
const News=require('../models/news')
const newsController=require('../controllers/newsController')

router.get('/news', newsController.getAllNews)
router.get('/news/:id',newsController.getNewsByID)
router.post('/news',authAd,newsController.addNews)
router.put('/news/:id',authAd,newsController.updateNews)
router.delete('/news/:id',authAd, newsController.deleteNews)

module.exports= router