const fs = require('fs');
const path = require('path');
const { stdout } = process;

const filePath = path.join(__dirname, './text.txt'); // указываем путь к файлу text.txt

const readStream = fs.createReadStream(filePath);

readStream.pipe(process.stdout); // направляем поток чтения в стандартный поток вывода
