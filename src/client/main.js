require([
    'ng',
    'components'
], function(
    ng,
    components
){
    var app = ng.module('app', [
        'ngRoute',
        'components'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {
                template: '<cp-home ng-controller="homeCtrl"></cp-home>'
            }).
            when('/game/:gameId', {
                template: '<cp-game ng-controller="gameCtrl"></cp-game>'
            }).
            when('/about', {
                template: '<cp-about></cp-about>'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

    ng.element(document).ready(function() {
        ng.bootstrap(document, ['app']);
    });
});