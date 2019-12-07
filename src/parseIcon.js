/* eslint-disable no-console */
var fs = require('fs');
var path = require('path');
// /** 
//  * A utility to parse all the icons in a given folder and return a custom JSON object.
//  * Also create a css file in public directory with class name as icon name.
//  * @pseudo  
//  * 1. read files.
//  * 2. store files.
//  * 3. send files
//  */

const parseIcons = () => {
  let __dir = process.cwd();
  let args = process.argv.splice(2);
  let basePath = args[0] ? args[0] : '/public/images';
  let fullPath = __dir + '/public' + basePath;
  console.log(process.cwd());
  readFiles(fullPath)
    .then(files => {
      writeCSS(processFiles(basePath, files.filter(file => /^.*\.(svg|png)$/.test(file))));
    })
    .catch(err => {
      console.log(err);
    })
}

const processFiles = (basePath, iconFiles) => {
  return {
    icons: iconFiles.map(icon => {
      let meta = path.parse(icon);
      return {
        ext: meta.ext,
        name: meta.name,
        fileName: meta.base,
        className: `gi-${meta.name}`,
        location: `${basePath}/${meta.base}`
      }
    })
  }
}

// const writeJSON = () => {

// }

const writeCSS = (icons) => {
  console.log(icons)
  var stream = fs.createWriteStream("./src/assets/icons.css");
  stream.once('open', () => {
    let types = [{
      name: '',
      size: '24'
    }, {
      name: 'small',
      size: '16'
    }, {
      name: 'large',
      size: '36'
    }]
    icons.icons.forEach(icon => {
      types.forEach(type => {
        if (type.name == '') {
          stream.write(`.gid-${icon.name} {\n`);
        } else {
          stream.write(`.gid-${icon.name}--${type.name} {\n`);
        }
        stream.write(`  width: ${type.size}px;\n`);
        stream.write(`  height: ${type.size}px;\n`);
        stream.write(`  background: url("${icon.location}");\n`);
        stream.write(`  background-size: ${type.size}px ${type.size}px;\n`);
        stream.write(`}\n`);
      })
    })
    stream.end();
  });
}

const readFiles = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, filenames) => {
      if (err) {
        reject(err);
      } else {
        resolve(filenames);
      }
    });
  });
}

parseIcons();