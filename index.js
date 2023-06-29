// module.exports = () => {
//   // ...
// };


//dejar el resolve y reyect para el final de las funciones

const { isAbsolute,
  relativeToAbsolute } = require('./mdLinks')


const filePath = process.argv[2]; // lee el tercer parámetro que anotamos

function mdLinks (path, options)  {
  return new Promise((resolve, reject) => {
    let absolutePath;
    const validate = isAbsolute(path)
    if (validate) {
      absolutePath = path;
    } else {
      absolutePath = relativeToAbsolute(filePath);
    };
    isValid(absolutePath)
    .then((isValid) => {
      console.log(isValid); //true o false
    })
    catch ((err) => {
      console.error(err);
    });
  })};
}

      mdLinks(filePath).then(res => console.log(res))
      .catch(err => console.log(err));

  function relativeToAbsolute(relative) {
    return path.resolve(route)
  }