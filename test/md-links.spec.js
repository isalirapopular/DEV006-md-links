const { mdLinks } = require('../index.js');


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

