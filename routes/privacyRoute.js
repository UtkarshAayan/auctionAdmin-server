const express = require('express');
const router = express.Router();
const privacyPolicyController = require('../controllers/privacyPolicyController');

router.post('/create', privacyPolicyController.createPrivacy);

router.get('/', privacyPolicyController.getPrivacy);

router.put('/:id', privacyPolicyController.updatePrivacy);

router.delete('/:id', privacyPolicyController.deletePrivacy);

module.exports = router;
