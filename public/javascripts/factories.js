angular.module('sl.factory',[])
    .factory('WebSocketFactory', function(){
        var factory = {
            ioSocket : io.connect()
        };

        factory.registerCallbackForEvent = function(eventName, callback){
            factory.ioSocket.on(eventName, function(data){
                callback(data);
            });
        };

        factory.updateList = function(listId){
            factory.ioSocket.emit('update-list', { 'listId': listId});
        };

        return factory;
    });
