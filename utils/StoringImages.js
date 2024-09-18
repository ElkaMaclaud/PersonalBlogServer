const mongoose = require('mongoose');
const Image = require("../models/Image")

const saveImage = async (imagePath) => {
  const image = fs.readFileSync(imagePath);
  const newImage = new Image({
    data: image,
    contentType: 'image/png' 
  });
  await newImage.save();
};

// const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
// const fs = require('fs');

// const conn = mongoose.createConnection('mongodb://localhost:27017/mydatabase');
// let gfs;

// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
// });


// const saveImage = (imagePath) => {
//   const writestream = gfs.createWriteStream({
//     filename: 'myImage.png'
//   });
//   fs.createReadStream(imagePath).pipe(writestream);
// };


// const getImage = (filename) => {
//   gfs.files.findOne({ filename }, (err, file) => {
//     if (!file || file.length === 0) {
//       return console.log('Файл не найден');
//     }
//     const readstream = gfs.createReadStream(file.filename);
//     readstream.pipe(res); 
//   });
// };
