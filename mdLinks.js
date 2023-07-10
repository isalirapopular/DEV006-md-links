const path = require("path");
const fs = require('fs');
const axios = require('axios');

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

function getFilesInDirectory(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err); // Rechaza la promesa si hay un error al leer el directorio
            } else {
                const filePaths = files
                    .map((file) => path.join(directoryPath, file))
                    .filter((filePath) => path.extname(filePath) === ".md"); // Filtra solo los archivos con extensión ".md"

                if (filePaths.length === 0) {
                    reject("El directorio no contiene archivos .md");
                } else {
                    resolve(filePaths);
                    console.log('Este directorio contiene archivo .md')
                }
            }
        });
    });
}

function readMDFile(route) {
    return new Promise((resolve, reject) => {
        fs.readFile(route, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
function extractLinksFromMarkdown(content,file) {
    const regex = /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g;
    const links = [];
    let match;
  
    while ((match = regex.exec(content)) !== null) {
      const text = match[1];
      const url = match[2];
      links.push({ text, url, file });
    }
  
    return links;
  }





module.exports = {
    isAbsolute,
    relativeToAbsolute,
    isValidPath,
    isFile,
    getFilesInDirectory,
    readMDFile,
    extractLinksFromMarkdown
   
}