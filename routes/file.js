const router = require('express').Router();
const {uploadFile, showFile, downloadFile, sendEmail} = require('../controller/file.controller');



router.post('/file',uploadFile);
router.get('/show/:id', showFile);
router.get('/:id', downloadFile);
router.post('/send', sendEmail);


module.exports = router

