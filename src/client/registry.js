define('registry', [
    'ng',
    'service/cpStyle',
    'service/i18n',
    'langSelector/ctrl',
    'home/ctrl',
    'game/ctrl'
], function(
    ng,
    cpStyle,
    i18n,
    langSelectorCtrl,
    homeCtrl,
    gameCtrl
){

    var registry = ng.module('registry', []);

    //service
    cpStyle(registry);
    i18n(registry);

    //controller
    langSelectorCtrl(registry);
    homeCtrl(registry);
    gameCtrl(registry);

    return registry;

});