angular.module('shoppingListApp', ['ngRoute', 'sl.factory' ,'sl.controllers'])
    .config(function($routeProvider){
    $routeProvider.when('/',
        {
            controller: 'ListsController' ,
            templateUrl: 'partials/lists'
        }).when('/createList',{
            controller: 'CreateListController' ,
            templateUrl: 'partials/createlist'
        }).when('/editList/:listId',{
            controller: 'EditListController' ,
            templateUrl: 'partials/editlist'
        }).when('/deleteList/:listId',{
            controller: 'DeleteListController' ,
            templateUrl: 'partials/deletelist'
        }).otherwise({
            redirectTo: '/'
        });
});
