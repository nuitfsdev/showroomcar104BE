const express=require('express');
const authADandEP = require('../middleware/authADandEP');
const router=new express.Router()
const customerController=require('../controllers/customerController')

router.get('/users/customers',authADandEP, customerController.getAllCustomers)
router.get('/users/customers/:id',authADandEP , customerController.getCustomerByID)
router.post('/users/customers',authADandEP, customerController.addCustomer)
router.put('/users/customers/:id',authADandEP, customerController.updateCustomer)
router.delete('/users/customers/:id',authADandEP, customerController.deleteCustomer)


module.exports= router