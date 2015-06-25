define('game/ctrl', [
    'ng',
    'text!game/tpl.html'
], function(
    ng,
    tpl
){
    return function(ngModule){
        ngModule
        .controller('gameCtrl', [ '$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
            var pollTimeout = null;
            $scope.id = $routeParams.id;
            $scope.join = function(){
                $http.post('api/join', {id: $scope.id}).success(function(data){
                    ng.extend($scope, data);
                    $scope.turnStartDate = Date.parse($scope.turnStart);
                    pollTimeout = setTimeout($scope.poll, 1000);
                    console.log(data);
                });
            };
            $scope.poll = function(){
                $http.post('api/poll', {id: $scope.id, v: $scope.v}).success(function(data){
                    ng.extend($scope, data);
                    $scope.turnStartDate = Date.parse($scope.turnStart);
                    if(!$scope.myTurn){
                        getInfoTimeout = setTimeout($scope.poll, 1000);
                    }else{
                        getInfoTimeout = null;
                    }
                    console.log(data);
                });
            };
            $scope.choose = function(choice){
                if($scope.myTurn) {
                    $http.post('api/act', {act: 'choose', val: choice}).success(function (data) {
                        ng.extend($scope, data);
                        $scope.turnStartDate = Date.parse($scope.turnStart);
                        getInfoTimeout = setTimeout($scope.getInfo, 1000);
                        console.log(data);
                    });
                }
            };
            $scope.restart = function(){
                $http.post('api/act', {act: 'restart'}).success(function (data) {
                    ng.extend($scope, data);
                    $scope.turnStartDate = Date.parse($scope.turnStart);
                    getInfoTimeout = setTimeout($scope.poll, 1000);
                    console.log(data);
                });
            };
            $scope.join();
        }])
        .directive('cpGame', function(){
            return {restrict: 'E', template: tpl};
        });
    }
});