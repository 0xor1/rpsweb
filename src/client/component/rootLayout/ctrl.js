define('rootLayout/ctrl', [
    'text!rootLayout/style.css',
    'text!rootLayout/tpl.html'
], function(
    style,
    tpl
){
    return function(ngModule){
        ngModule
            .controller('rootLayoutCtrl', [ 'cpStyle', function(cpStyle){
                cpStyle('rootLayoutCtrl', style);
            }])
            .directive('cpRootLayout', function(){
                return {restrict: 'E', template: tpl};
            });
    }
});