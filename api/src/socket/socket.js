const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (filePath) => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

const socketExecute = (socket) => {
  console.log('a user connected');
  const socketId = socket.id;
  const imageBasePath = `assets/${socketId}.jpg`;
  const imagePath = `ml/assets/${socketId}.jpg`;

  ensureDirectoryExistence(imagePath);
  fs.writeFileSync(imagePath, '', () => {});

  socket.on('blob', (data) => {
    const outputFileName = `ml/assets/${socketId}.jpg`;

    fs.writeFileSync(outputFileName, data);

    const read = fs.readFileSync(outputFileName);

    socket.emit('blob:return', read.buffer);
  });

  socket.on('blob:start', (workout) => {
    const pythonProcess = spawn('python3', [
      '../../ml/main.py',
      imageBasePath,
      workout,
    ]);

    pythonProcess.stdout.on('data', (data) => {
      // Do something with the data returned from python script
      console.log('data :>> ', data);
    });

    socket.emit('blob:start-response');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    fs.unlink(imagePath, () => {});
  });
};

module.exports = socketExecute;
