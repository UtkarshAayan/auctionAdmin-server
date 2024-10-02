const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');


router.post('/create', countryController.createCountry);
router.get('/all', countryController.getCountries);
router.get('/:id', countryController.getCountryById);  
router.put('/:id', countryController.updateCountry);  
router.delete('/:id', countryController.deletecountry);  
module.exports = router;
