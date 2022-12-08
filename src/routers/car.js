const express=require('express');
const router=new express.Router()
const authAd = require('../middleware/authAd');
const carController=require('../controllers/carController')

router.get('/cars', carController.getAllCar)
router.get('/cars/:id',carController.getCarByID)
router.post('/cars',authAd,carController.addCar)
router.put('/cars/:id',authAd,carController.updateCar)
router.delete('/cars/:id',authAd,carController.deleteCar )

module.exports= router