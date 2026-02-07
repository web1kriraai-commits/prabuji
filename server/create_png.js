const fs = require('fs');
const path = require('path');

const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const buffer = Buffer.from(base64Image, 'base64');
fs.writeFileSync(path.join(__dirname, 'test.png'), buffer);
console.log('test.png created');
