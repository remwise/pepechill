const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');
// const fileTypeFromBuffer = require('file-type').fileTypeFromBuffer;

const ensureDirectoryExistence = (filePath) => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

// const blobToBase64 = (blob) => {
//     return new Promise((resolve, _) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.readAsDataURL(blob);
//     });
//   }

const socketExecute = (socket) => {
  console.log('a user connected');
  const socketId = socket.id;
  const imageBasePath = `assets/${socketId}.jpg`;
  const imagePath = `ml/assets/${socketId}.jpg`;

  ensureDirectoryExistence(imagePath);
  fs.writeFileSync(imagePath, '', () => {});
  // ! add workout third param
  const pythonProcess = spawn('python3', ['../../ml/main.py', imageBasePath]);

  pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
    console.log('data :>> ', data);
  });

  //   socket.on("send data", async ({ data }) => {
  // const base64 = await blobToBase64(data);
  // console.log("send data");
  // fs.writeFile(`ml/assets/${socketId}.jpeg`, data, () => {});
  //   });

  socket.on('blob', (data) => {
    const buffer = Buffer.from(data);

    const outputFileName = `ml/assets/${socketId}.jpg`;

    fs.createWriteStream(outputFileName).write(buffer);

    socket.emit('blob:return', data);
  });

  socket.on('blob:start', () => {
    socket.emit('blob:start-response');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    fs.unlink(imagePath, () => {});
  });
};

module.exports = socketExecute;
