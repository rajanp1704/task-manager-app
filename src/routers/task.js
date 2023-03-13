const express = require('express');
const Task = require('../models/tasks.js');
const auth = require('../middleware/auth.js');

const router = new express.Router();

////////Reading endpoint: all TASK
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }
  try {
    // const task = await Task.find({ owner: req.user._id });

    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    console.log(req.user.tasks);
    res.status(200).send(JSON.stringify(req.user.tasks));
  } catch (error) {
    res.status(500).send();
  }

  // Task.find({})
  //   .then(tasks => {
  //     res.send(tasks);
  //   })
  //   .catch(error => {
  //     res.status(500).send(error);
  //   });
});
////////

////////Reading endpoint: TASK using id
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findById(_id);

    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    // console.log(task);
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }

  //   Task.findById(_id)
  //     .then(task => {
  //       if (!task) {
  //         return res.status(404).send();
  //       }
  //       res.send(task);
  //     })
  //     .catch(error => {
  //       res.status(500).send();
  //     });
});
/////////

////////////Updating endpoint: update TASK using id
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['completed', 'description'];

  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    res.status(404).send({ error: 'Invalid updates!' });
  }

  try {
    // const task = await Task.findById(req.params.id);

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => {
      task[update] = req.body[update];
    });

    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
//////////////

////////Creation endpoint: TASK
router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);

  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    // console.log(task);
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }

  //   task
  //     .save()
  //     .then(() => {
  //       res.status(201).send(task);
  //     })
  //     .catch(error => {
  //       res.status(400).send(error);
  //     });
});
///////

////////Deleting endpoint: delete TASK
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});
////////////

module.exports = router;
