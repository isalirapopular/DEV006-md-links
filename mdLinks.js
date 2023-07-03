const path = require("path");
const fs = require('fs');

function isAbsolute(route) {
    return path.isAbsolute(route)
}

function relativeToAbsolute(route) {
    return path.resolve(route)
}

function isValidPath(route) {
    return new Promise((resolve) => {
        fs.access(route, fs.constants.F_OK, (err) => {
            if (err) {
                resolve(false); // La ruta no es válida
            } else {
                resolve(true); // La ruta es válida
            }
        });
    });
}

function isFile(route) {
    return new Promise((resolve, reject) => {
        fs.stat(route, (error, stats) => {
            if (error) {
                reject(error); // Rechaza la promesa con el error
            } else if (stats.isFile()) {
                resolve(true); // Resuelve la promesa como true si es un archivo
            } else if (stats.isDirectory()) {
                resolve(false); // Resuelve la promesa como false si es un directorio
            }
        });
    });
}

function findFileInDirectory(directoryPath, fileName) {
    return new Promise((resolve, reject) => {
        fs.stat(directoryPath, (err, stats) => {
            if (err) {
                reject(err); // Rechaza la promesa si hay un error al obtener información del directorio
            } else {
                if (stats.isDirectory()) {
                    fs.readdir(directoryPath, (err, files) => {
                        if (err) {
                            reject(err); // Rechaza la promesa si hay un error al leer el directorio
                        } else {
                            let foundFile = false;

                            // Recorre los archivos y directorios en el directorio
                            for (let file of files) {
                                const filePath = path.join(directoryPath, file);

                                // Si el archivo actual es el que estamos buscando, resuelve la promesa con su ruta completa
                                if (file === fileName) {
                                    resolve(filePath);
                                    foundFile = true;
                                    break;
                                }

                                // Si es un directorio, realiza una búsqueda recursiva en ese directorio
                                if (fs.statSync(filePath).isDirectory()) {
                                    return findFileInDirectory(filePath, fileName)
                                        .then((foundFilePath) => {
                                            if (foundFilePath) {
                                                resolve(foundFilePath);
                                                foundFile = true;
                                            }
                                        })
                                        .catch((err) => {
                                            reject(err);
                                        });
                                }
                            }

                            // Si no se encontró el archivo en este directorio ni en ninguno de sus subdirectorios
                            if (!foundFile) {
                                resolve(null);
                            }
                        }
                    });
                } else {
                    resolve(null); // La ruta no es un directorio
                }
            }
        });
    });
}

function getFilesInDirectory(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err); // Rechaza la promesa si hay un error al leer el directorio
            } else {
                const filePaths = files.map((file) => path.join(directoryPath, file));
                resolve(filePaths);
            }
        });
    });
    
}

module.exports = {
    isAbsolute,
    relativeToAbsolute,
    isValidPath,
    isFile,
    findFileInDirectory,
    getFilesInDirectory
}