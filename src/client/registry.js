define('registry', [
    'ng',
    'service/i18n',
    'langSelector/ctrl',
    'home/ctrl',
    'game/ctrl'
], function(
    ng,
    i18n,
    langSelectorCtrl,
    homeCtrl,
    gameCtrl
){

    var registry = ng.module('registry', []);

    //service
    i18n(registry);

    //controller
    langSelectorCtrl(registry);
    homeCtrl(registry);
    gameCtrl(registry);

    return registry;

});