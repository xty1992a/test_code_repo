const fs = require('fs')
const {join} = require('path')

var handleCircular = function() {  
    var cache = [];
    var keyCache = []
    return function(key, value) {
        if (typeof value === 'object' && value !== null) {
            var index = cache.indexOf(value);
            if (index !== -1) {
                return '[Circular ' + keyCache[index] + ']';
            }
            cache.push(value);
            keyCache.push(key || 'root');
        }
        return value;
    }
}

var tmp = JSON.stringify;  
JSON.stringify = function(value, replacer, space) {  
    replacer = replacer || handleCircular();
    return tmp(value, replacer, space);
}

module.exports = function ({ types }) {
    return {
        name: '@babel/plugin-simple',
        visitor: {
            Identifier(path, state) {
                fs.writeFile(join(__dirname, 'path.json'), JSON.stringify(path), (e, d) => {
                    console.log(e ? 'error' : 'success')
                })
                const name = path.node.name
                if(state.opts.maps[name]) {
                    path.node.name = state.opts.maps[name]
                }
            }
        }
    }

}