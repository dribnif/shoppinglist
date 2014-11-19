exports.getCollection = function (req,collName){
    collName = !collName ? 'shoppinglists' : collName;
    return req.mongoDb.get(collName);
};

exports.dateFormatGerman = "D.M.YYYY HH:mm:ss";


//var Utils = {
//
//    getCollection: function (req,collName){
//        collName = !collName ? 'shoppinglists' : collName;
//        return req.mongoDb.get(collName);
//    },
//
//    dateFormatGerman : "D.M.YYYY HH:mm:ss"
//}
//
//
//module.exports = Utils;
