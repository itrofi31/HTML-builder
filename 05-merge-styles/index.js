const { stat, createReadStream } = require('fs');
const fs = require('fs/promises');
const path = require('path');
const { stdout } = require('process');
const { PassThrough } = require('stream');
const passThrough = new PassThrough();

console.log(__dirname);

const mergeStyles = async function () {
  try {
    let dataAll = '';
    const srcPath = path.join(__dirname, 'styles');
    const destPath = path.join(__dirname, 'project-dist');
    const bundeFile = path.join(destPath, 'bundle.css');
    //create folder project-dist
    await fs.mkdir(destPath, { recursive: true });
    //create bundle.css
    await fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '');

    //create css file

    //read all style files
    const files = await fs.readdir(srcPath, { withFileTypes: true });
    for (let file of files) {
      const filePath = path.join(srcPath, file.name);
      const stat = await fs.stat(filePath);
      const size = +(stat.size / 1024).toFixed(3);
      const isCss = path.extname(filePath) === '.css';

      if (isCss && file.isFile) {
        //write data to a variable dataAll
        const file = createReadStream(filePath);
        file.on('data', (data) => {
          passThrough.write(data);
        });
        file.on('end', () => {
          passThrough.end();
        });

        passThrough.on('data', (data) => {
          dataAll += data.toString();
        });
        passThrough.on('end', () => {});
      }
    }
    await fs.appendFile(bundeFile, dataAll, (err, data) => {
      if (err) console.error(err);
    });
    console.log('Files successfully merged');
  } catch (error) {
    console.log(error);
  }
};
mergeStyles();
