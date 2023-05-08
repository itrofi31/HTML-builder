const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function whatsInside(route) {
  const files = await fs.readdir(route, { withFileTypes: true });

  for (const file of files) {
    if (file.name === '.gitkeep') {
      continue;
    }

    const filePath = path.join(route, file.name);
    const stats = await fs.stat(filePath);
    const fileSize = stats.size / 1024;
    const fileExtension = path.extname(filePath).substring(1);
    const output = () =>
      console.log(
        `${file.name.slice(
          0,
          file.name.indexOf('.')
        )}-${fileExtension}-${fileSize.toFixed(3)}kb`
      );

    if (file.isFile()) {
      output();
    } else if (file.isDirectory()) {
      output();
      whatsInside(filePath);
    }
  }
}

whatsInside(folderPath);
