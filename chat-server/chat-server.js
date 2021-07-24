
var express = require('express');
var socket = require('socket.io');

var app = express();
const port = app.listen(process.env.PORT || 4000);
var server = app.listen(port, function () {
    console.log('listening for requests on port 4000');
});

var io = socket(server);
var users = {};

io.on('connection', (socket) => {
    
    console.log('user connected', socket.id);
    socket.on('joinRoom', function (data) {
        socket.join(data.room);
    });

    socket.on('newUser', function (data) {
        users[data.username] = socket.id;
    });

    socket.on('activeUsers', function (data) {
        if (!data.isActive) {
            delete users[data.username];
        }
        io.sockets.emit('activeUsers', { data: Object.keys(users) });
    });

    socket.on('chat', function (data) {
        if (data.room) {
            io.to(data.room).emit('chat', data);
        } else {
            io.to(users[data.receiver]).to(users[data.sender]).emit('chat', data);
        }
    });

    socket.on('typing', function (data) {
        if (data.room) {
            io.to(data.room).emit('typing', data);
        } else {
            io.to(users[data.receiver]).emit('typing', data);
        }
    });

});
