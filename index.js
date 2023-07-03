const { isAbsolute, relativeToAbsolute, isValidPath, isFile, findFileInDirectory, getFilesInDirectory } = require('./mdLinks.js');

const filePath = process.argv[2];

// reemplazar "\"" por "/" (CONSTRUIR)
 function removeSpaces(path) {
  return path.replace(/\s/g, ''); // expresión regular que modifica la ruta para que no contenga espacios.
}

function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    let absolutePath;
    const validate = isAbsolute(path); // Valida si la ruta es absoluta

    if (validate) {
      absolutePath = path;
    } else {
      const filePathWithoutSpaces = removeSpaces(filePath);
      absolutePath = relativeToAbsolute(filePathWithoutSpaces); // Convierte ruta relativa en absoluta
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
        if (isFile) {console.log("es archivo")}
        else {
          console.log("es directorio")
          getFilesInDirectory(absolutePath)
          .then((filePaths) => {
            console.log("Archivos disponibles:");
            console.log(filePaths);
          })
          .catch((error) => {
            console.error("Error al obtener la lista de archivos:", error);
          });   
          };
      })
      .catch((error) => {
        console.error('Error: No es archivo');
      });
    
      function isMarkdownFile(file) {
        return file.toLowerCase().endsWith('.md');
      }
      
      mdLinks(filePath)
        .then((res) => {
          if (res) {
            console.log('Result:', res);
            const markdownFiles = res.filter(isMarkdownFile);
            console.log('Markdown files:', markdownFiles);
          }
        })
        .catch((err) => console.log(err));
  });
}


mdLinks(filePath)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));