const { isAbsolute, 
  relativeToAbsolute, 
  isValidPath, 
  isFile, 
  readMDFile,
  extractLinksFromMarkdown
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
        console.log('La ruta es válida:', isValid); // Valida si la ruta existe (es válida)
      })
      .catch((err) => {
        console.error('La ruta no es válida');
      });

  isFile(absolutePath)
  .then((isFile) => {
    if (isFile) {
      if (!absolutePath.endsWith('.md') && !absolutePath.endsWith('.MD')) {
        console.log('El archivo no tiene la extensión .md');
        return;
      }
      console.log("Es un archivo .md");
      
      readMDFile(absolutePath)
        .then((fileContent) => {
          const links = extractLinksFromMarkdown(fileContent);
          const promises = links.map((link) => {
            if (options.validate) {
              return axios.head(link.href)
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
            } else {
              return Promise.resolve({
                ...link,
                status: null,
                ok: 'ok'
              });
            }
          });

          Promise.all(promises)
            .then((results) => {
              console.log("Acá puedes obtener el resultado de los enlaces:");
              console.log(results);
            })
            .catch((error) => {
              console.error("Error al validar los enlaces:", error);
            });
        })
        .catch((error) => {
          console.error("Error al leer el archivo:", error);
        });
    } else {
      console.log("es directorio");
    }
  })
  .catch((error) => {
    console.error('Error: No es archivo');
  });
  });
}


mdLinks(filePath, { validate: true })
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
  