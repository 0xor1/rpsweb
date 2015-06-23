define('components', [
    'ng',
    'home/ctrl',
    'game/ctrl'
], function(
    ng,
    homeCtrl,
    gameCtrl
){

    var components = ng.module('components', []);

    homeCtrl(components);
    gameCtrl(components);

    return components;

});