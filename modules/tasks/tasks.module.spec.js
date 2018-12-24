const tasks = require('./tasks.module');
const helpers = require('../../tests/helpers');
const expect = require('chai').expect;

describe('Tasks testing module', () => {

  before(() => {
    return helpers.clear();
  });

  const taskData = {
    description: 'Create backend API',
    due: new Date('2018-12-25')
  };

  let item;

  it('should create a task', async () => {
    const task = await tasks.create(taskData);

    item = task;

    expect(task.description).to.equal(taskData.description);
    expect(task.due).to.equal(taskData.due);
  });

  it('should update a task', async () => {
    const result = await tasks.update({
      _id: item._id
    }, {
      description: 'implement frontend part'
    });

    expect(result.length).to.equal(1);
    expect(result[0].description).to.equal('implement frontend part');
  });

  it('should find a task', async () => {
    const task = await tasks.findOne({
      _id: item._id
    });

    expect(task.description).to.equal('implement frontend part');
  });

  it('should fetch the list tasks', async () => {
    const list = await tasks.find();

    expect(list.length).to.equal(1);
  });

  it('should delete a task', async () => {
    const result = await tasks.remove({
      _id: item._id
    });

    expect(result.n).to.equal(1);

    const list = await tasks.find();

    expect(list.length).to.equal(0);
  });
});

