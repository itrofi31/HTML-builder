const { createReadStream } = require('fs');
const fs = require('fs/promises');
const path = require('path');

console.log(__dirname);

const mergeStyles = async function () {
  try {
    const srcPath = path.join(__dirname, 'styles');
    const destPath = path.join(__dirname, 'project-dist');
    const bundeFile = path.join(destPath, 'bundle.css');

    //create folder project-dist
    await fs.mkdir(destPath, { recursive: true });

    //read all style files
    const files = await fs.readdir(srcPath, { withFileTypes: true });

    //create an array of Promises that resolve with the contents of each file
    const promises = files
      .filter((file) => file.isFile() && path.extname(file.name) === '.css')
      .map((file) => {
        const filePath = path.join(srcPath, file.name);
        return new Promise((resolve, reject) => {
          const fileStream = createReadStream(filePath);
          let data = '';
          fileStream.on('data', (chunk) => (data += chunk));
          fileStream.on('end', () => resolve(data));
          fileStream.on('error', reject);
        });
      });

    //wait for all promises to resolve
    const contents = await Promise.all(promises);

    //combine all contents into a single string
    const combined = contents.join('');

    //write the combined content to the output file
    await fs.writeFile(bundeFile, combined);
    console.log('Files successfully merged');
  } catch (error) {
    console.log(error);
  }
};

mergeStyles();
