module.exports = function(io){
    const express = require('express');
    const router = express.Router();
    let history = [];

    router.get('/', function(req, res, next) {
        res.render('index', { title: 'El Super Canvas Colaborativo' });
    });

    io.on('connection',(socket) => {
        console.log('Un usuario conectado');
        console.log('Sincronizando nuevo usuario')
        for(let item of history) {
            socket.emit('update_canvas',item);
        }
        socket.on('update_canvas',function(data){
            history.push(data);
            socket.broadcast.emit('update_canvas',data);
        });

        socket.on('clear', function(data){
            history = [];
            socket.broadcast.emit('clear', data);
        });

    })
    return router;
}