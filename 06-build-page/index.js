const { createReadStream, readdir, readFile } = require('fs');
const fs = require('fs/promises');
const path = require('path');
const { PassThrough } = require('stream');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) =>
  console.error(err)
);

(async function () {
  try {
    let html = (
      await fs.readFile(path.join(__dirname, 'template.html'))
    ).toString();
    let components = [];

    let folderComponents = await fs.readdir(
      path.join(__dirname, 'components'),
      {
        withFileTypes: true,
      }
    );
    for (let component of folderComponents) {
      const fileName = component.name.slice(0, component.name.indexOf('.'));

      html = html.replace(
        `{{${fileName}}}`,
        await fs.readFile(
          path.join(__dirname, 'components', `${fileName}.html`)
        )
      );
    }

    // let header = (
    //   await fs.readFile(path.join(__dirname, 'components', 'header.html'))
    // ).toString();

    // let articles = (
    //   await fs.readFile(path.join(__dirname, 'components', 'articles.html'))
    // ).toString();

    // let footer = (
    //   await fs.readFile(path.join(__dirname, 'components', 'footer.html'))
    // ).toString();

    // html = html
    //   .replace('{{header}}', header)
    //   .replace('{{articles}}', articles)
    //   .replace('{{footer}}', footer);
    // console.log(html);

    //create new html for project-dist
    await fs.writeFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      html,
      { recursive: true },
      (err) => {}
    );
    console.log('index.html created');

    //create styles.css file

    await fs.writeFile(
      path.join(__dirname, 'project-dist', 'style.css'),
      '',
      { recursive: true },
      (err) => {}
    );

    const files = await fs.readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    });
    for (let file of files) {
      const passThrough = new PassThrough();
      const newStream = createReadStream(
        path.join(__dirname, 'styles', file.name)
      );
      newStream.on('data', (data) => {
        passThrough.write(data);
      });
      newStream.on('end', () => {
        passThrough.end();
      });

      //data of all css files
      passThrough.on('data', (data) => {
        fs.appendFile(
          path.join(__dirname, 'project-dist', 'style.css'),
          data.toString(),
          (err, data) => {
            if (err) console.error(err);
          }
        );
      });
    }
    console.log('style.css merged');

    async function copyDir(src, dest) {
      // create destination folder
      await fs.mkdir(dest, { recursive: true });

      // read the source directory
      const entries = await fs.readdir(src, { withFileTypes: true });

      // iterate over entries
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          // recursively copy subdirectories
          await copyDir(srcPath, destPath);
        } else {
          // copy files
          await fs.copyFile(srcPath, destPath);
        }
      }
    }
    await copyDir(
      path.join(__dirname, 'assets'),
      path.join(__dirname, 'project-dist', 'assets')
    );
  } catch (error) {
    console.error(`Something wrong: ${error}`);
  }
})();
