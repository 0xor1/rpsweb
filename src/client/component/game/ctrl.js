define('game/ctrl', [
    'ng',
    'text!game/tpl.html'
], function(
    ng,
    tpl
){
    return function(ngModule){
        ngModule
            .controller('gameCtrl', [ '$scope', '$routeParams', '$http', 'i18n', function($scope, $routeParams, $http, i18n){
                $scope.id = $routeParams.id;
                $scope._WAITING_FOR_OPPONENT = 0;
                $scope._GAME_IN_PROGRESS = 1;
                $scope._WAITING_FOR_RESTART = 2;
                $scope._DEACTIVATED = 3;
                var pollTimeout = null;
                var poll = function(){
                    $http.post('api/poll', {id: $scope.id, v: $scope.v}).success(function(data){
                        ng.extend($scope, data);
                        if($scope.state !== $scope._DEACTIVATED){
                            pollTimeout = setTimeout(poll, 1000);
                        }else{
                            pollTimeout = null;
                        }
                        console.log(data);
                    });
                };
                $scope.choose = function(choice){
                    if($scope.state === $scope._GAME_IN_PROGRESS /*&& after turnStart*/) {
                        $http.post('api/act', {act: 'choose', val: choice}).success(function (data) {
                            ng.extend($scope, data);
                            $scope.turnStartDate = Date.parse($scope.turnStart);
                            pollTimeout = setTimeout($scope.getInfo, 1000);
                            console.log(data);
                        });
                    }
                };
                $scope.restart = function(){
                    $http.post('api/act', {act: 'restart'}).success(function (data) {
                        ng.extend($scope, data);
                        $scope.turnStartDate = Date.parse($scope.turnStart);
                        pollTimeout = setTimeout(poll, 1000);
                        console.log(data);
                    });
                };
                $http.post('api/join', {id: $scope.id}).success(function(data){
                    ng.extend($scope, data);
                    $scope.turnStartDate = Date.parse($scope.turnStart);
                    pollTimeout = setTimeout(poll, 1000);
                    console.log(data);
                    console.log($scope.turnStartDate);
                });
            }])
            .directive('cpGame', function(){
                return {restrict: 'E', template: tpl};
            });
    }
});