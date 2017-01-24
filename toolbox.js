function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

/**
 * Logging helper for single variables
 * @param {string} sender - (optional) The calling function (there is no
 * ECMA standard way to use callee/caller in strict mode).
 * @param {*} variable - The var to log to the console
 * @param {string} varName -  Optional, will appear as a label before the var
 */
function dd(variable, varName, sender='') {
    var varNameOutput;

    varName = varName || '';
    varNameOutput = varName ? varName + ':' : '';

    console.log(sender + ' => ' + varNameOutput, variable, ' (' + (typeof variable) + ')');
}

export { guid, dd };
