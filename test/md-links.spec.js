const { mdLinks } = require('../index.js');

const path = 'Muestras/README.md'; 
const options = { validate: true };

describe('mdLinks', () => {
  it('debería retornar una promesa que se resuelva con un array de objetos', (done) => {
    const result = mdLinks(path, options);
    expect(result).resolves.toEqual([
      {
        text: 'Linea de comando CLI',
        url: 'https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e',
        file: '/Users/isa/Library/CloudStorage/OneDrive-Personal/ISA/001.CURSOS/Laboratoria/04.Junio/DEV006-md-links/README.md',
        status: 200,
        ok: 'ok'
      }
    ]).then(done);
  });
});

describe('mdLinks', () => {
  it('debería identificar correctamente un archivo Markdown', (done) => {
    const path = 'Muestras/README.md'; // 

    mdLinks(path, { validate: true })
      .then((result) => {
        expect(result).toEqual(expect.arrayContaining([
          expect.objectContaining({
            file: path,
          }),
        ]));
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});