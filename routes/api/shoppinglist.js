var express = require('express');
var utils = require('../../util/utils.js');
var getRouter = express.Router();

getRouter.get('/:listId', function(req, res) {
    var slColl =  utils.getCollection(req);
    var lid = req.params.listId;

    slColl.find({'_id': lid}, function(err, queryResultArr) {
        res.send(queryResultArr[0] ? queryResultArr[0] : "Your query did not return any results" );
    });

}).put('/:listId', insertOrUpdate)
.post('/:listId', insertOrUpdate)
.delete('/:listId/:itemName', function(req, res){
        var slColl =  utils.getCollection(req);
        var lid = req.params.listId;

        if (lid && lid.match(/^[0-9a-fA-F]{24}$/)) {

            var itemName = req.params.itemName;
            if (itemName){
                var toDelete = { 'itemname': itemName };

                proceedIfListExists(slColl, lid, toDelete, res, removeListEntry);
            } else {
                res.send(400, "You need to provide a valid itemName ");
            }
        } else {
            res.send(400, "The supplied List ID is not valid.");
        }
    });



//put and post do the same shite
function insertOrUpdate(req, res){
    var slColl =  utils.getCollection(req);
    var lid = req.params.listId;

    if (lid && lid.match(/^[0-9a-fA-F]{24}$/)) {

        var itemName = req.body.itemName;
        var itemStatus = req.body.itemStatus;
        if (itemName && itemStatus){
            var newElem = { 'itemname': itemName ,
                'itemstatus': itemStatus };

            proceedIfListExists(slColl, lid, newElem, res, upsert);
        } else {
            res.send(400, "You need to provide valid itemName and itemStatus properties.");
        }
    } else {
        res.send(400, "The supplied List ID is not valid.");
    }
}




//checks to see if an entry with the same name already exists in the list. if it finds one,
// it will return its index. Otherwise will return -1
function findElementIndex(shoppingList, itemName){
    for (var i=0; i<shoppingList.length; i++){
        if (shoppingList[i].itemname.toUpperCase() === itemName.toUpperCase()){
            return i;
        }
    }
    return -1;
}


function proceedIfListExists(slColl, lid, newElem, res, action){

    slColl.find({'_id': lid}, function (err, queryResultArr) {
        if (queryResultArr[0]) {
            action(slColl, lid, newElem, queryResultArr, res );
        } else{
            res.send(400, "The List with the supplied ID does not exist anymore.");
        }
    });
}

function upsert(slColl, lid, newElem, queryResultArr, res){
    var shoppingList = queryResultArr[0].list;
    var elemIdx = findElementIndex(shoppingList, newElem.itemname);
    var msg = '';
    if (elemIdx<0){
        //create
        shoppingList.push(newElem);
        msg = 'Create new element: ';
    }else{
        shoppingList[elemIdx] = newElem;
        msg = 'Update existing element: ';
    }

    slColl.update({'_id': lid}, { $set: {"list": shoppingList} }, function(err, numOfModifiedDocs){
        if (!err && numOfModifiedDocs>0) {
            res.send(201, "Success" + msg + newElem.itemname);
        } else {
            res.send(400, "FAILED to " + msg);
        }
    });
}

function removeListEntry(slColl, lid, elem, queryResultArr, res){
    var shoppingList = queryResultArr[0].list;
    var elemIdx = findElementIndex(shoppingList, elem.itemname);
    if (elemIdx<0){
        //does not exist in list
        res.send(400,'Element with requested name does not exist in list! ');
    }else{
        shoppingList.splice(elemIdx,1);
        slColl.update({'_id': lid}, { $set: {"list": shoppingList} }, function(err, numOfModifiedDocs){
            if (!err && numOfModifiedDocs>0) {
                res.send(201, "Successfully removed " + elem.itemname);
            } else {
                res.send(400, "FAILED to remove element: " + elem.itemname);
            }
        });
    }

}


module.exports = getRouter;