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
                template: '<cp-home ng-controller="homeCtrl"></cp-home>'
            })
            .when('/game/:id', {
                template: '<cp-game ng-controller="gameCtrl"></cp-game>'
            })
            .when('/about', {
                template: '<cp-about></cp-about>'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

    ng.element(document).ready(function() {
        ng.bootstrap(document, ['app']);
    });
});