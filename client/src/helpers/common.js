const equals = function(a, b){
    return a === b;
}
const isEmpty = function(obj){
    if(obj === undefined || obj == null) return true
    return (Object.keys(obj).length === 0 && obj.constructor === Object)
}

exports.equals = equals;
exports.isEmpty = isEmpty;