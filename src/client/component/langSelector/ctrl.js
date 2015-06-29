+define('langSelector/ctrl', [
    'text!langSelector/langs.json',
    'text!langSelector/tpl.html'
], function(
    langs,
    tpl
){
    return function(ngModule){
        ngModule
            .controller('langSelectorCtrl', [ '$scope', 'i18n', function($scope, i18n){
                $scope.langs = JSON.parse(langs);
                $scope.change = function(){
                        if($scope.selected && $scope.selected.code)
                                i18n.setLang($scope.selected.code);
                        else
                            i18n.setLang(null);
                    };
            }])
            .directive('cpLangSelector', function(){
                return {restrict: 'E', template: tpl};
            });
    };
});