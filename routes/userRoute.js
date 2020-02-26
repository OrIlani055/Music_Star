const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/checkUser', (req, res) => {
    userController.checkUser(req, res);
});

router.post('/createUserInfo', (req, res) => {
    userController.createUserInfo(req, res);
});

// default route
router.all('*', (req, res) => {
    res.status(404).json({
        status:404,
        message: "Wrong route",
        action: "Unknown",
        data: null
    })
});


module.exports = router;