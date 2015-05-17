angular.module('sl.controllers',[])
    .controller("ListsController",
    function($scope, $http) {
        $http.get('/api/lists')
            .success(function(data, status, headers, config) {
                $scope.zelists = data;
            });
    }
).controller("EditListController",
    function($scope, $http, $routeParams, WebSocketFactory) {
        var loadListContent = function(lId){
            $http.get('/api/shoppinglist/'+lId)
                .success(function(data, status, headers, config) {
                    $scope.listHolder = data;
                }).error(function(data){
                    $scope.srverror = data;
                });
        };


        WebSocketFactory.registerCallbackForEvent('list-updated', function(data){
            if (data.listId === $routeParams.listId){
                loadListContent(data.listId);
            }
        });

        $scope.newItem = '';
        $scope.addItem = function(){
            if ($scope.newItem){
                $http.post('/api/shoppinglist/' + $routeParams.listId, {'itemName':$scope.newItem, 'itemStatus':'N'})
                    .success(function(data){
                        WebSocketFactory.updateList($routeParams.listId);
                        //loadListContent($routeParams.listId);
                    }).error(function(data){
                        $scope.srverror="Failed to create the item because, " + data;
                    });
            }
        };

        $scope.delete = function(list){
            if ($routeParams.listId && list.itemname){
                $http.delete('/api/shoppinglist/' + $routeParams.listId  + '/' + list.itemname)
                    .success(function(data){
                        WebSocketFactory.updateList($routeParams.listId);
                        loadListContent($routeParams.listId);
                    }).error(function(data){
                        $scope.srverror="Failed to dee the item because, " + data;
                    });
            }
            console.log(list);
        };

        $scope.toggleStatus= function(list){
            if ($routeParams.listId && list.itemname){

                list.itemstatus = (list.itemstatus && list.itemstatus.toUpperCase() === 'N')?'B':'N';

                $http.post('/api/shoppinglist/' + $routeParams.listId,{'itemName':list.itemname, 'itemStatus': list.itemstatus})
                    .success(function(data){
                        WebSocketFactory.updateList($routeParams.listId);
                        loadListContent($routeParams.listId);
                    }).error(function(data){
                        $scope.srverror="Failed to dee the item because, " + data;
                    });
            }
        };

        loadListContent($routeParams.listId);
    }
).controller("DeleteListController",
    function($scope, $http, $routeParams, $location) {

        $http.get('/api/shoppinglist/'+$routeParams.listId)
            .success(function(data, status, headers, config) {
                $scope.list = data;
            }).error(function(data){
                $scope.srverror = data;
            });

        $scope.deleteList = function(){
            $http.delete('/api/lists/'+ $routeParams.listId)
                .success(function(data, status, headers, config) {
                    $location.url('/');
                }).error(function(data, status){
                    $scope.srverror = status + ": " + data;
                });
        };

        $scope.goHome = function(){
            $location.url('/');
        };
    }

).controller("CreateListController",
    function($scope, $http, $location){
        $scope.list={};
        $scope.createList = function(){
            $http.post('/api/lists', {'listName':$scope.list['listName']}).
                success(function(data){
                    $location.url('/');
                }).error(function(data){
                    $scope.srverror = data;
                    console.log('ERROR ',data);
                });
        };
    }
);
