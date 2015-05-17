var socket = require('socket.io');

exports.initWebSocket = function(server){

    var io = socket.listen(server);

    io.sockets.on('connection', function(socket){
        socket.on('update-list', function(data){
            console.log('The following list was updated! ', data.listId);
            /*io.sockets.emit('list-updated',{ listId : data.listId});*/
            socket.broadcast.emit('list-updated',{ listId : data.listId});
        });
    });

};