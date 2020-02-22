const express = require('express');
const router = express.Router();
const googleController = require('../controller/googleController');

router.get('/', (req, res) => {
    googleController.startauth(req, res);
});

router.get('/gCallback', (req, res) => {
    googleController.googleCallBack(req, res);
});

// router.post('/GtoDB', (req, res) => {
//     googleController.createGoogleUser(req, res);
// });

router.get('/calander', (req, res) => {
    googleController.profileview();
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