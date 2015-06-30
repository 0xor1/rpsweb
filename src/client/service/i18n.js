define('service/i18n', [
], function(
){
    return function(ngModule){
        ngModule
            .service('i18n', ['$rootScope', function($rootScope){
                var lang_change_event = 'i18n_lang_change_event',
                    last_lang,
                    service;
                service = function(scope, i18nTxt){
                    if(typeof i18nTxt === 'string'){
                        i18nTxt = JSON.parse(i18nTxt);
                    }
                    var langChangeHandler = function(event, lang){
                        var idx = i18nTxt.langs.indexOf(lang);
                        idx = idx === -1? 0: idx;
                        scope.lang = scope.lang != i18nTxt.langs[idx]? i18nTxt.langs[idx]: scope.lang;
                    };
                    langChangeHandler(null, last_lang);
                    scope.$on(lang_change_event, langChangeHandler);
                    scope.txt = function(strId){
                        return i18nTxt[strId][scope.lang];
                    };
                };
                service.setLang = function(lang){
                    if(typeof lang === 'string' && lang.length > 2){
                        lang = lang.substring(0, 2);
                    }
                    last_lang = lang;
                    $rootScope.$broadcast(lang_change_event, lang);
                };
                return service;
            }]);
    }
});