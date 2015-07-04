define('service/cpStyle', [
], function(
){

    var id = 'cp_style_id',
        alreadyAdded = {};

    document.head.innerHTML += '<style id="'+id+'"></style>';
    var el = document.getElementById(id);

    return function(ngModule){
        ngModule
            .service('cpStyle', function(){
                return function(cpCtrlName, styleStr){
                    if(!cpCtrlName)
                        throw 'cpCtrlName must be defined';
                    if(typeof styleStr === 'undefined' || styleStr === null)
                        throw 'styleStr must be defined';
                    if(alreadyAdded[cpCtrlName])
                        return;
                    el.innerHTML += styleStr + ' ';
                    alreadyAdded[cpCtrlName] = true;
                };
            });
    }
});