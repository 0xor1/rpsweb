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
                    langChangeHandler = function(event, lang){
                        idx = i18nTxt.langs.indexOf(lang);
                        if(idx === -1){
                            idx = 0;
                        }
                        if(scope.lang != i18nTxt.langs[idx]){
                            scope.$applyAsync(function(){
                                scope.lang = i18nTxt.langs[idx];
                            })
                        }
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