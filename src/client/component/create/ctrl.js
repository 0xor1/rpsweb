define('create/ctrl', [
    'text!create/style.css',
    'text!create/tpl.html'
], function(
    style,
    tpl
){
    return function(ngModule){
        ngModule
            .controller('createCtrl', [ '$scope', '$http', '$location', 'cpStyle', function($scope, $http, $location, cpStyle){
                cpStyle('createCtrl', style);
                $scope.create = function(){
                    $http.post('api/create').success(function(data){
                        if(data.id)
                            $location.path('game/' + data.id);
                    });
                };
                $scope.create();
            }])
            .directive('cpCreate', function(){
                return {restrict: 'E', template: tpl};
            });
    }
});