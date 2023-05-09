const fs = require('fs/promises');
const path = require('path');

async function copyDirectory(src, dest) {
  try {
    await fs.rm(dest, { recursive: true });

    await fs.mkdir(dest, { recursive: true });

    const files = await fs.readdir(src, { withFileTypes: true });
    // const destFiles = await fs.readdir(dest, { withFileTypes: true });
    // if (destFiles.length > 0) {
    //   for (const file of files) {
    //     console.log(file);
    //     const destPath = path.join(dest, file.name);
    //     await fs.unlink(destPath, (err) => {});
    //   }
    // }

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
