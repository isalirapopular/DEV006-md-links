const path = require('path');
const fs = require ('fs'); // módulo para saber si la ruta existe

function isAbsolute(route) {
    return path.isAbsolute(route)
}
//video adrian revisar

function relativeToAbsolute (route) {
    return path.resolve(route)
}
function isValidPath(route) {
    const exist = (route) => {
        return new Promise ((resolve) => {
            fs.access(route,fs.constants.F_OK, (err) => {
                if (err) {
                    resolve(false, 'la ruta no es válida');//la ruta no es válida
                } else {
                    resolve (true, 'la ruta es válida'); //la ruta es válida
                }
            });
        });
}



    module.exports = {
        isAbsolute,
        relativeToAbsolute,
        isValidPath
    }