const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function whatsInside() {
  const files = await fs.readdir(folderPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const stats = await fs.stat(filePath);
      const fileSize = stats.size / 1024;
      const fileExtension = path.extname(filePath).substring(1);

      console.log(
        `${file.name.slice(0, -4)}-${fileExtension}-${fileSize.toFixed(3)}kb`
      );
    } else {
      console.log(`${file.name.slice(0, -4)} is not a file`);
    }
  }
}

whatsInside();
