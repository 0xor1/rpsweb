require([
    'ng',
    'ngRoute',
    'registry'
], function(
    ng
){
    var app = ng.module('app', [
        'ngRoute',
        'registry'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                template: '<cp-create ng-controller="createCtrl"></cp-create>'
            })
            .when('/game/:id', {
                template: '<cp-game ng-controller="gameCtrl"></cp-game>'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

    ng.element(document).ready(function() {
        ng.bootstrap(document, ['app']);
    });
});