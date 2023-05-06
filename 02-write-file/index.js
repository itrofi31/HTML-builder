const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');

fs.writeFile(path.join(__dirname, 'text2.txt'), '', (err) => {
  if (err) throw err;
  console.log('File created');

  stdout.write('Enter text (or "exit"):');
  stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') {
      console.log('Proccess closing.');
      stdin.pause();
    } else {
      fs.appendFile(path.join(__dirname, 'text2.txt'), data, (err, text) => {
        console.log(text);
      });
    }
  });
});
