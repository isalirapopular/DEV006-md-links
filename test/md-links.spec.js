const { mdLinks } = require('../index.js');
const { getFilesInDirectory } = require('../mdLinks.js');

const axios = require('axios');
const fs = require('fs');

describe('mdLinks', () => {
  it('debería retornar una promesa que se resuelva con un array de objetos', () => {
    const path = 'Muestras/README.md';
    const options = { validate: true };

    return mdLinks(path, options).then((result) => {
      // Verificar que el resultado sea un array
      expect(Array.isArray(result)).toBe(true);

      // Verificar que cada elemento del array sea un objeto con las propiedades esperadas
      result.forEach((link) => {
        expect(link).toHaveProperty('text');
        expect(link).toHaveProperty('url');
        expect(link).toHaveProperty('file');
        expect(link).toHaveProperty('status');
        expect(link).toHaveProperty('ok');
      });
    });
  });
});

describe('getFilesInDirectory index.js', () => {
  it('Debe resolver con la lista de archivos Markdown dentro del directorio', () => {
    const directoryPath = '/Users/isa/Library/CloudStorage/OneDrive-Personal/ISA/001.CURSOS/Laboratoria/04.Junio/DEV006-md-links/Muestras';

    // Mock de fs.readdir para devolver archivos específicos
    jest.spyOn(fs, 'readdir').mockImplementation((route, callback) => {
      const files = ['Muestras/README.md'];
      callback(null, files);
    });

    const expected = [
      '/Users/isa/Library/CloudStorage/OneDrive-Personal/ISA/001.CURSOS/Laboratoria/04.Junio/DEV006-md-links/Muestras/Muestras/README.md',
    ];

    return expect(getFilesInDirectory(directoryPath)).resolves.toEqual(expected);
  });
});
