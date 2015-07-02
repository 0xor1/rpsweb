define('home/ctrl', [
    'text!home/style.css',
    'text!home/tpl.html'
], function(
    style,
    tpl
){
    return function(ngModule){
        ngModule
            .controller('homeCtrl', [ '$scope', '$http', '$location', 'cpStyle', function($scope, $http, $location, cpStyle){
                cpStyle('homeCtrl', style);
                $scope.create = function(){
                    $http.post('api/create').success(function(data){
                        if(data.id)
                            $location.path('game/' + data.id);
                    });
                };
                $scope.create();
            }])
            .directive('cpHome', function(){
                return {restrict: 'E', template: tpl};
            });
    }
});