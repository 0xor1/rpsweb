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

                $scope.joined = false;
                $scope.id = $routeParams.id;
                $scope._WAITING_FOR_OPPONENT = 0;
                $scope._GAME_IN_PROGRESS = 1;
                $scope._WAITING_FOR_REMATCH = 2;
                $scope._DEACTIVATED = 3;

                $scope.options = null;
                $scope.pastChoices = null;
                $scope.resultHalfMatrix = null;
                $scope.turnLength = null;
                $scope.rematchTimeLimit = null;
                $scope.maxTurns = null;
                $scope.myIdx = null;
                $scope.turnStart = null;
                $scope.state = null;
                $scope.currentChoices = null;
                $scope.pastChoicesCount = null;
                $scope.penultimateChoices = null;

                var pollTimeout = null;
                var timerTimeout = null;
                var lastTurnStartStr = null;
                var pastChoicesLenAtLastSetWin = 0;

                $scope.choose = function(choice){
                    var now = new Date();
                    if($scope.state === $scope._GAME_IN_PROGRESS && $scope.turnStartDate < now) {
                        $http.post('api/act', {act: 'choose', val: choice}).success(function (data) {
                            updateScope(data);
                        });
                    }
                };

                $scope.rematch = function(){
                    if($scope.state === $scope._WAITING_FOR_REMATCH)
                    $http.post('api/act', {act: 'restart'}).success(function (data) {
                        updateScope(data);
                    });
                };

                $scope.newGame = function(){
                    $location.path('/');
                };

                function join() {
                    $scope.joined = false;
                    getInfo('api/join', {id: $scope.id});
                }

                function poll(){
                    getInfo('api/poll', {id: $scope.id, v: $scope.v});
                }

                function getInfo(apiPath, reqData){
                    clearTimeout(pollTimeout);
                    $http.post(apiPath, reqData).success(function(data){
                        updateScope(data);
                        if($scope.state !== $scope._DEACTIVATED){
                            pollTimeout = setTimeout(poll, 1000);
                        }else{
                            pollTimeout = null;
                        }
                    }).error(function(){
                        if(apiPath === 'api/join'){
                            $scope.newGame();
                        }
                    });
                }

                function updateScope(data){
                    if(typeof data === 'object') {
                        ng.extend($scope, data);
                        setPastChoices();
                        setWins();
                        $scope.joined = true;
                        $scope.link = window.location.href;
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

                function setPastChoices(){
                    if($scope.pastChoices.length + 1 === $scope.pastChoicesCount){
                        var p1Choice = $scope.penultimateChoices[0];
                        var p2Choice = $scope.penultimateChoices[1];
                        $scope.pastChoices.push([p1Choice, p2Choice]);
                    } else if($scope.pastChoices.length !== $scope.pastChoicesCount){
                        //gone out of sync somehow, rejoin!
                        join();
                    }
                }

                function setWins(){
                    $scope.wins = $scope.wins || [0, 0];

                    var pc = $scope.pastChoices;
                    var pcLen = pc.length;

                    if(pastChoicesLenAtLastSetWin == pcLen) return;

                    var idxs = {};
                    var opsLen = $scope.options.length;

                    for(var i = 0; i < opsLen; i++){
                        idxs[$scope.options[i]] = i;
                    }

                    var p1C = '';
                    var p2C = '';
                    var p1CIdx = 0;
                    var p2CIdx = 0;
                    var rhm = $scope.resultHalfMatrix;
                    var p1Result;

                    for(var i = pastChoicesLenAtLastSetWin; i < pcLen; i++){
                        p1C = pc[i][0];
                        p2C = pc[i][1];

                        if(p1C == p2C) continue;
                        p1CIdx = idxs[p1C];
                        p2CIdx = idxs[p2C];

                        if(p1CIdx > p2CIdx){
                            p1Result = rhm[p1CIdx - 1][p2CIdx];
                        }else{
                            p1Result = rhm[p2CIdx - 1][p1CIdx] * -1;
                        }

                        if(p1Result === 1){
                            $scope.wins[0] += 1;
                        }else{
                            $scope.wins[1] += 1;
                        }
                    }

                    pastChoicesLenAtLastSetWin = pcLen;
                }

                function setTimer(){
                    clearTimeout(timerTimeout);
                    var now = (new Date()).getTime();
                    var turnStart = $scope.turnStartDate.getTime();
                    //TODO
                }

                join();
            }])
            .directive('cpGame', function(){
                return {restrict: 'E', template: tpl};
            });
    }
});