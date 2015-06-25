define('home/ctrl', [
    'text!home/tpl.html'
], function(
    tpl
){
    return function(ngModule){
        ngModule
        .controller('homeCtrl', [ '$scope', '$http', '$location', function($scope, $http, $location){
            $scope.create = function(){
                $http.post('api/create').success(function(data){
                    if(data.id)
                        $location.path('game/' + data.id);
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