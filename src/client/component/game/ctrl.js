define('game/ctrl', [
    'ng',
    'text!game/style.css',
    'text!game/tpl.html',
    'text!game/txt.json'
], function(
    ng,
    style,
    tpl,
    txt
){
    return function(ngModule){
        ngModule
            .controller('gameCtrl', [ '$scope', '$routeParams', '$http', '$location', 'cpStyle', 'i18n', function($scope, $routeParams, $http, $location, cpStyle, i18n){
                cpStyle('gameCtrl', style);
                i18n($scope, txt);

                $scope.id = $routeParams.id;
                $scope._WAITING_FOR_OPPONENT = 0;
                $scope._GAME_IN_PROGRESS = 1;
                $scope._WAITING_FOR_RESTART = 2;
                $scope._DEACTIVATED = 3;

                var pollTimeout = null;
                var timerTimeout = null;
                var lastTurnStartStr = null;

                var poll = function(){
                    $http.post('api/poll', {id: $scope.id, v: $scope.v}).success(function(data){
                        addPropertiesToScope(data);
                        if($scope.state !== $scope._DEACTIVATED){
                            pollTimeout = setTimeout(poll, 1000);
                        }else{
                            pollTimeout = null;
                        }
                    });
                };

                $scope.choose = function(choice){
                    var now = new Date();
                    if($scope.state === $scope._GAME_IN_PROGRESS && $scope.turnStartDate < now) {
                        $http.post('api/act', {act: 'choose', val: choice}).success(function (data) {
                            addPropertiesToScope(data);
                        });
                    }
                };

                $scope.restartGame = function(){
                    var now = new Date();
                    if($scope.state === $scope._WAITING_FOR_RESTART)
                    $http.post('api/act', {act: 'restart'}).success(function (data) {
                        addPropertiesToScope(data);
                    });
                };

                $scope.newGame = function(){
                    $location.path('/');
                };

                $http.post('api/join', {id: $scope.id}).success(function(data){
                    addPropertiesToScope(data);
                    pollTimeout = setTimeout(poll, 1000);
                });

                function addPropertiesToScope(data){
                    if(typeof data === 'object') {
                        ng.extend($scope, data);
                        if(data.turnStart.substring(0, 1) === '0'){
                            $scope.turnStartDate = null;
                        }else{
                            $scope.turnStartDate = new Date(data.turnStart);
                            if(lastTurnStartStr !== $scope.turnStart){
                                lastTurnStartStr = $scope.turnStart;
                                setTimer();
                            }
                        }
                        console.log(data);
                        console.log($scope.turnStartDate);
                    }
                }

                function setTimer(){
                    clearTimeout(timerTimeout);
                    var now = (new Date()).getTime();
                    var turnStart = $scope.turnStartDate.getTime();
                }
            }])
            .directive('cpGame', function(){
                return {restrict: 'E', template: tpl};
            });
    }
});