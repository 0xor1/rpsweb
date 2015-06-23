define('home/ctrl', [
    'text!home/tpl.html'
], function(
    tpl
){
    return function(ngModule){
        ngModule
        .controller('homeCtrl', [ '$scope', '$http', '$location', function($scope, $http, $location){
            $scope.play = function(){
                $http.post('api/play').success(function(data){
                    if(data.gameId)
                        $location.path('game/' + data.gameId);
                });
            };
            $scope.about = function(){
                $location.path('about');
            };
        }])
        .directive('cpHome', function(){
            return {restrict: 'E', template: tpl};
        });
    }
});