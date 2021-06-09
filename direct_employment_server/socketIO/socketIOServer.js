const {ChatModel} = require('../db/models');

module.exports = function (server) {
    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log('Client connected to server.');
        socket.on('sendMsg', function ({from, to, content}) {
            console.log('Server receive message from browser:', {from, to, content});

            const chat_id = [from, to].sort().join('_');
            const create_time = Date.now();

            new ChatModel({from, to, content, chat_id, create_time}).save(function (error, chatMsg) {
                if (error) {
                    console.log(error);
                }
                io.emit('receiveMsg', chatMsg);
                console.log('Server send message to browser:', chatMsg);
            });
        });
        socket.on('end', function() {
            // socket.disconnect('unauthorized');
            socket.disconnect();   
            console.log('client disconnected from server');
        });
    
    });
};
