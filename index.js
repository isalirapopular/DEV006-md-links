const { isAbsolute, 
  relativeToAbsolute, 
  isValidPath, 
  isFile, 
  getFilesInDirectory, 
   } = require('.mdLinks');

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
          console.log("es archivo");
        } else {
          console.log("es directorio");
          getFilesInDirectory(absolutePath)
            .then((filePaths) => {
              console.log("Estos son los archivos MD disponibles:");
              console.log(filePaths);
            })
            .catch((error) => {
              console.error("Error al obtener la lista de archivos:", error);
            });   
        }
      })
      .catch((error) => {
        console.error('Error: No es archivo');
      });
  });
}

mdLinks(filePath)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

  