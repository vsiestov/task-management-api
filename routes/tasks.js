/*eslint new-cap: off */

const express = require('express');
const router = express.Router();
const access = require('../modules/access/access.module');
const tasks = require('../modules/tasks/tasks.module');
const validation = require('../modules/helpers/validation.module');
const messages = require('../modules/helpers/messages.module');
const constants = require('../modules/helpers/constants.module');

router.get('/', access.verifyToken, async (req, res) => {
  const list = await tasks.find({
    userId: req.user._id
  });

  res.send(list);
});

router.get('/:id',
  access.verifyToken,
  validation.endpoints.tasks.readOne,
  validation.check, async (req, res) => {
    const task = await tasks.findOne({
      _id: req.params.id
    });

    if (!task) {
      return res
        .status(constants.codes.INVALID_ARGUMENTS)
        .send(messages.error(constants.messages.undefinedRecord, 'id', 'path'));
    }

    return res.send(task);
  });

router.post('/',
  access.verifyToken,
  validation.endpoints.tasks.create,
  validation.check, async (req, res) => {
    const body = req.body;

    const task = await tasks.create(Object.assign({
    }, body, {
      userId: req.user._id,
      due: new Date(body.due)
    }));

    res.send(task);
  });

router.put('/:id',
  access.verifyToken,
  validation.endpoints.tasks.update,
  validation.check, async (req, res, next) => {
    const body = req.body;
    const params = req.params;
    const data = {
    };

    for (const item in body) {

      if (body.hasOwnProperty(item)) {
        switch (item) {
        case 'due':
          data[item] = new Date(body[item]);
          break;

        default:
          data[item] = body[item];
        }
      }

    }

    try {
      const result = await tasks.update({
        _id: params.id
      }, data);

      return res.send(result[0]);
    } catch ($exception) {
      return next($exception);
    }
  });

router.delete('/:id',
  access.verifyToken,
  validation.endpoints.tasks.readOne,
  validation.check, async (req, res) => {
    await tasks.remove({
      _id: req.params.id
    });

    res.send(messages.success());
  });

module.exports = router;
