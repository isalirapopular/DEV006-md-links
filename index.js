const {
  isAbsolute,
  relativeToAbsolute,
  isValidPath,
  isFile,
  readMDFile,
  extractLinksFromMarkdown,
  getFilesInDirectory
} = require('./mdLinks.js');

const axios = require('axios');
const filePath = process.argv[2];

function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    let absolutePath;
    const validate = isAbsolute(path); // Valida si la ruta es absoluta

    if (validate) {
      absolutePath = path;
    } else {
      absolutePath = relativeToAbsolute(path); // Convierte ruta relativa en absoluta
    }

    isValidPath(absolutePath)
      .then((isValid) => {
        if (!isValid) {
          throw new Error('La ruta no es válida');
        }
        return isFile(absolutePath);
      })
      .then((isFile) => {
        if (isFile) {
          if (!absolutePath.endsWith('.md') && !absolutePath.endsWith('.MD')) {
            console.log('El archivo no tiene la extensión .md');
            return [];
          }
          console.log('Es un archivo .md');
          return [absolutePath];
        } else {
          return getFilesInDirectory(absolutePath);
        }
      })
      .then((filePaths) => {
        if (filePaths.length === 0) {
          throw new Error('El directorio no contiene archivos MD');
        }

        const promises = filePaths.map((file) => {
          return readMDFile(file)
            .then((fileContent) => {
              const links = extractLinksFromMarkdown(fileContent,file);
              if (options.validate) {
                const linkPromises = links.map((link) => {
                  return axios
                    .head(link.url)
                    .then((response) => ({
                      ...link,
                      status: response.status,
                      ok: response.status >= 200 && response.status < 400 ? 'ok' : 'fail'
                    }))
                    .catch((error) => ({
                      ...link,
                      status: null,
                      ok: 'fail'
                    }));
                });
                return Promise.all(linkPromises);
              } else {
                return links;
              }
            })
            .catch((error) => {
              console.error(`Error al leer el archivo ${file}:`, error);
              return [];
            });
        });

        return Promise.all(promises);
      })
      .then((results) => {
        const flattenedResults = results.flat();
        console.log('Acá puedes obtener el resultado de los enlaces:');
        console.log(flattenedResults);
        resolve(flattenedResults);
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error);
      });
  });
}

mdLinks(filePath, { validate: true })
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
