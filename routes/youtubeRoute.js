const router = require('express').Router();
const youtubeController = require('../controller/youtubeController');

router.get('/search/:q', (req, res) => {
   youtubeController.searchPlaylist(req,res);
});

router.post('/:playlist/insert',(req, res) => {
    youtubeController.insertToplaylist(req,res);
});

router.post('/create/:id', (req, res) => {
    youtubeController.create(req, res);
});
router.put('/update/:id', (req, res) => {
    youtubeController.update(req, res);
});
router.delete('/delete/:id', (req, res) => {
    youtubeController.delete(req, res);
});
router.get('/:id/read', (req, res) => {
    youtubeController.read(req, res);
});
router.get('/read', (req, res) => {
    youtubeController.readAll(req, res);
});




module.exports = router;

