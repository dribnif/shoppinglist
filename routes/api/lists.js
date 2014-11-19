var express = require('express');
var utils = require('../../util/utils.js');
var moment = require('moment');
var router = express.Router();


function createShoppingListJSON(name){
    var now = new Date();
    return  { 'created': now,
        'modified': now,
        'listname': name,
        'list':[]
    }
}

function getHumanReadableDate(date){
    return date ? moment(date).format(utils.dateFormatGerman):"-";
}

router.get('/', function(req, res) {
    var slColl = utils.getCollection(req);
    slColl.find({}, function(err, queryResultArr){
        var resultArr = [];
        for(var i=0; i<queryResultArr.length; i++){
            var sl = queryResultArr[i];
            console.log('ShoppingList: ', sl);
            var listEntry = {"listname" : sl.listname,
                             "listId" : sl._id,
                             "created": getHumanReadableDate(sl.created),
                             "modified":getHumanReadableDate(sl.modified)
                            };
            resultArr.push(listEntry);
        }
        res.status(200).send(resultArr);
    });
}).post('/', function(req, res){ //create new list
    var collection = utils.getCollection(req);
    var name = req.body.listName;

    console.log("ListName = ", name);

    collection.find({"listname":name}, function(err, dbres) {
        //console.log(dbres);
        if (!dbres || dbres.length == 0){
            collection.insert(createShoppingListJSON(name), function(err, doc){
                if (err){
                    res.status(400).send("An error occurred while creating a new list: ", err);
                } else{
                    res.status(200).send("Success, created " + doc.listname + ", " +doc._id);
                }
            });
        } else{
            res.status(409).send("A shoppinglist by the same name " + name + " already exists. I shall not modify it. ");
        }
    });


}).put('/', function(req, res){//update list ... just the name for now.
    var collection = utils.getCollection(req);
    var listId = req.body.listId;
    var listName = req.body.listName;
    if (listId && listId.match(/^[0-9a-fA-F]{24}$/) && listName) {
        console.log("attempting to update list name");

        var now = new Date();
        collection.update({"_id": listId}, { $set: {"listname": listName, "modified": now} }, function (err, numOfModifiedDocs) {
            console.log(numOfModifiedDocs);
            console.log("ERROR: " + err);
            if (!err && numOfModifiedDocs>0) {
                res.status(200).send("Updated the List Name!!!" + listName);
            } else {
                res.status(400).send("FAILED to update the List Name!!!");
            }
        });
    } else {
        res.status(400).send("You need to supply both a (valid) Id of the list to be updated, " +
            "as well as a valid value for the new list name");
    }

}).delete('/:listId', function(req, res){
    var slc = utils.getCollection(req);
    var lid = req.params.listId

    console.log("ListId = ", lid);

    slc.remove({"_id":lid}, function(err, removed) {
        console.log(removed);
        console.log(err);
        if (err){
            res.status(400).send("Failed to delete Entry.... because " + err);
        } else if (removed>0){
            res.status(200).send("Success!!!! Deleted the fucker ");
        } else{
            res.status(400).send("Failed to delete Entry.... because there was none with the given ID in the db");
        }
    });


});

module.exports = router;
