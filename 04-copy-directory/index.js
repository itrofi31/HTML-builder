const fs = require('fs/promises');
const path = require('path');

async function copyDirectory(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const files = await fs.readdir(src, { withFileTypes: true });

    for (const file of files) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);
      await fs.copyFile(srcPath, destPath);
    }

    // console.log(`Directory copied from ${src} to ${dest}`);
  } catch (err) {
    console.error(err);
  }
}

copyDirectory(
  path.join(__dirname, 'files'),
  path.join(__dirname, 'files-copy')
);
