var express = require('express');
var baseRouter = express.Router();

/* GET home page. */
baseRouter.get('/', function(req, res) {
  res.render('index', { title: 'ShoppingLists' });
}).get('/partials/:viewName', function(req, res){
    var jadeTplt = 'partials/' + req.params.viewName;
    res.render(jadeTplt);
});

module.exports = baseRouter;
