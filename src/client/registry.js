define('registry', [
    'ng',
    'home/ctrl',
    'game/ctrl'
], function(
    ng,
    homeCtrl,
    gameCtrl
){

    var registry = ng.module('registry', []);

    homeCtrl(registry);
    gameCtrl(registry);

    return registry;

});