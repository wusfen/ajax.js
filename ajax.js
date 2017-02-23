/**
 * ajax
 */
;
(function() {
    function ajax(options) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            // console.log(xhr.readyState, xhr.status, xhr.responseText);
            if (xhr.readyState == 4) {
                if (xhr.status == 0 || xhr.status == 200 || xhr.status == 304) {
                    options.success && options.success(
                        options.dataType == 'json' ?
                        eval(xhr.responseText) : xhr.responseText
                    );
                } else {
                    options.error && options.error();
                }
            }
        };
        xhr.open(options.type || 'GET', options.url, options.async !== undefined ? options.async : true);
        xhr.send();
    }

    // export
    if (typeof define != 'undefined' && (define.cmd || define.amd)) {
        define(function(require, exports, module) {
            return module.exports = ajax
        });
    } else
    if (typeof window != 'undefined') {
        window.ajax = ajax;
        if (typeof $ == 'undefined') {
            $ = {
                ajax: ajax
            };
        }
    }
})();
