const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Responder con un recurso');
});

module.exports = router;