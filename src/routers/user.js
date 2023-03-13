const express = require('express');
const User = require('../models/users.js');
const auth = require('../middleware/auth.js');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account.js');

const router = new express.Router();

// router.get('/test', (req, res) => {
//   res.send(`This is from user router`);
// });
// module.exports = router;

////////Creation endpoint: USER
router.post('/users', async (req, res) => {
  //   console.log(req.body);
  //   res.send(`Testing!`);

  const user = new User(req.body);

  try {
    await user.save();

    sendWelcomeEmail(user.email, user.name);

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }

  //   user
  //     .save()
  //     .then(() => {
  //       res.status(201).send(user);
  //     })
  //     .catch(error => {
  //       res.status(400).send(error);
  //     });
});
////////////

/////////////// LOGOUT endpoint: one USER session
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.status(200).send(`Logout Successfull!`);
  } catch (error) {
    res.status(500).send();
  }
});
////////////////

/////////////// LOGOUT endpoint: all USER session
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.status(200).send(`Logout Successfully from ALL`);
  } catch (error) {
    res.status(500).send();
  }
});
////////////////

////////Reading endpoint: all USER
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);

  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (error) {
  //   res.status(500).send();
  // }
  //////
  // User.find({})
  //   .then(users => {
  //     res.send(users);
  //   })
  //   .catch(error => {
  //     res.status(500).send(error);
  //   });
});
////////

// ////////Reading endpoint: USER using id
// router.get('/users/:id', async (req, res) => {
//   //   console.log(req.params);
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);

//     if (!user) {
//       return res.status(404).send();
//     }

//     res.send(user);
//   } catch (error) {
//     res.status(500).send();
//   }

//   // User.findById(_id)
//   //   .then(user => {
//   //     if (!user) {
//   //       return res.status(404).send();
//   //     }
//   //     res.send(user);
//   //   })
//   //   .catch(error => {
//   //     res.status(500).send();
//   //   });
// });
// /////////

////////Deleting endpoint: delete USER
router.delete('/users/me', auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).send();
    // }

    await req.user.remove();

    sendCancelEmail(req.user.email, req.user.name);

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});
////////////

////////////Updating endpoint: update USER using id
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];

  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    res.status(404).send({ error: 'Invalid updates!' });
  }

  try {
    // const user = await User.findById(req.params.id);

    updates.forEach(update => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    // if (!user) {
    //   return res.status(404).send();
    // }

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});
//////////////

////////Login endpoint: USER login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
//////////////

////////////////upload Avatar image
const avatar = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an Image file!'));
    }

    cb(undefined, true);
  },
});

router.post(
  '/users/me/avatar',
  auth,
  avatar.single('avatar'),
  async (req, res) => {
    // req.user.avatar = req.file.buffer;

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
////////////

///////////DELETE avatar image
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});
////////////

///////////loading avatar using id
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error('Not Found!');
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});
//////////

module.exports = router;
