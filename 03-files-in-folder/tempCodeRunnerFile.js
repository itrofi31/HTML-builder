const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');
async function whatsInside(route) {
  const files = await fs.readdir(route, { withFileTypes: true });
  for (const file of files) {
    let imgPath = path.join(__dirname, 'secret-folder', file.name);
    const filePath = path.join(folderPath, file.name);
    const stats = await fs.stat(filePath);
    const fileSize = stats.size / 1024;
    const fileExtension = path.extname(filePath).substring(1);
    if (file.isFile()) {
      console.log(
        `${file.name.slice(
          0,
          file.name.indexOf('.')
        )}-${fileExtension}-${fileSize.toFixed(3)}kb`
      );
    }
    //  (file.isDirectory())
    else {
      // whatsInside(imgPath);
    }
  }
}

whatsInside(folderPath);
