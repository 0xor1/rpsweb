define('registry', [
    'ng',
    'service/cpStyle',
    'service/i18n',
    'create/ctrl',
    'game/ctrl',
    'langSelector/ctrl',
    'rootLayout/ctrl'
], function(
    ng,
    cpStyle,
    i18n,
    createCtrl,
    gameCtrl,
    langSelectorCtrl,
    rootLayoutCtrl
){

    var registry = ng.module('registry', []);

    //service
    cpStyle(registry);
    i18n(registry);

    //controller
    createCtrl(registry);
    gameCtrl(registry);
    langSelectorCtrl(registry);
    rootLayoutCtrl(registry);

    return registry;

});