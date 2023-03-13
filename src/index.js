const express = require('express');
require('./db/mongoose.js');
// const User = require('./models/users.js');
// const Task = require('./models/tasks.js');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task.js');

const app = express();
const port = process.env.PORT;

// ////////multer for file upload
// const multer = require('multer');

// const upload = multer({
//   dest: 'images',
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     // if (!file.originalname.endsWith('.pdf')) {
//     //   return cb(new Error('Please upload a PDF!'));
//     // }
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error('Please upload a Word Document!'));
//     }

//     cb(undefined, true);

//     // cd(new Error('File must be a PDF!'));
//     // cb(undefined, true);
//     // cb(undefined, false);
//   },
// });

// // const errorMiddleware = (req, res, next) => {
// //   throw new Error('From my middleware!');

// //   // next();
// // };

// app.post(
//   '/upload',
//   upload.single('upload'),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );
// //////////

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
