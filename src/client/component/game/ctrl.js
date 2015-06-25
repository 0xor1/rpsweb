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
            var getInfoTimeout = null;
            $scope.gameId = $routeParams.gameId;
            $scope.getInitialInfo = function(){
                $http.post('api/join', {gameId: $scope.gameId}).success(function(data){
                    ng.extend($scope, data);
                    $scope.turnStartDate = Date.parse($scope.turnStart);
                    getInfoTimeout = setTimeout($scope.getInfo, 1000);
                    console.log(data);
                });
            };
            $scope.getInfo = function(){
                $http.post('api/getInfo', {gameId: $scope.gameId, version: $scope.version}).success(function(data){
                    ng.extend($scope, data);
                    $scope.turnStartDate = Date.parse($scope.turnStart);
                    if(!$scope.myTurn){
                        getInfoTimeout = setTimeout($scope.getInfo, 1000);
                    }else{
                        getInfoTimeout = null;
                    }
                    console.log(data);
                });
            };
            $scope.takeTurn = function(rowIdx, colIdx){
                if($scope.myTurn) {
                    $http.post('api/takeTurn', {row: rowIdx, col: colIdx}).success(function (data) {
                        ng.extend($scope, data);
                        $scope.turnStartDate = Date.parse($scope.turnStart);
                        getInfoTimeout = setTimeout($scope.getInfo, 1000);
                        console.log(data);
                    });
                }
            };
            $scope.getInitialInfo();
        }])
        .directive('cpGame', function(){
            return {restrict: 'E', template: tpl};
        });
    }
});