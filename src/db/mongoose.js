const mongoose = require('mongoose');
// const validator = require('validator');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// const User = mongoose.model('User', {
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error(`email is invalid`);
//       }
//     },
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(value) {
//       if (value < 0) {
//         throw new Error(`Age must be a positive number`);
//       }
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//     minLength: 7,
//     validate(value) {
//       //   if (value.length <= 6) {
//       //     throw new Error(`Password should be of more than 6 letters`);
//       //   }
//       if (value.toLowerCase().includes(`password`)) {
//         throw new Error(`Password can not contain 'password'`);
//       }
//     },
//   },
// });

// const me = new User({
//   name: '   Stuart',
//   email: `StUART@little.usa`,
//   password: 'qasdassword',
// });

// me.save()
//   .then(() => {
//     console.log(`SUCCESS! ${me}`);
//   })
//   .catch(error => {
//     console.log(`ERROR! ${error}`);
//   });

// ////////////challenge
// const Task = mongoose.model('Task', {
//   description: {
//     type: String,
//     trim: true,
//     required: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
// });

// const task = new Tasks({
//   description: 'Learn the mongoose Library',
// });

// task
//   .save()
//   .then(() => {
//     console.log(`SUCCESS! ${task}`);
//   })
//   .catch(error => {
//     console.log(`ERROR! ${error}`);
//   });
// //////////////////
