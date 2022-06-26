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
  const imagePath = `ml/assets/${socketId}.jpg`;
  const resPath = `ml/assets/res-${socketId}.jpg`;
  let pythonProcess;

  ensureDirectoryExistence(imagePath);
  ensureDirectoryExistence(resPath);

  fs.writeFileSync(imagePath, '', () => {});
  fs.writeFileSync(resPath, '', () => {});

  socket.on('blob', (data) => {
    fs.writeFileSync(imagePath, data);
  });

  fs.watchFile(resPath, (curr, prev) => {
    console.log(`${resPath} file Changed`);

    if (curr.isFile()) {
      const read = fs.readFileSync(resPath);

      socket.emit('blob:return', read.buffer);
    }
  });

  socket.on('blob:start', (workout) => {
    pythonProcess = spawn('python3', ['../../ml/main.py', socketId, workout]);

    pythonProcess.stdout.on('data', (data) => {
      // Do something with the data returned from python script
      console.log('data :>> ', data);
    });

    socket.emit('blob:start-response');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    pythonProcess?.kill();
    fs.unlink(imagePath, () => {});
    fs.unlink(resPath, () => {});
  });
};

module.exports = socketExecute;
