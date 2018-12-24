class Crud {
  constructor(Schema) {
    this.Schema = Schema;
  }

  /**
   * Create a document
   *
   * @param {Object} data - collection data
   * @returns {Promise<Object>} - result of creating
   */
  async create(data) {
    const obj = new this.Schema(data);

    await obj.save();

    return obj.toObject();
  }

  /**
   * Fetch the list of documents
   *
   * @param {Object} [selector] - mongo selector object
   * @returns {Promise<Array<Object>>} - the list of objects
   */
  async find(selector) {
    return await this.Schema.find(selector);
  }

  /**
   * Find a document
   *
   * @param {Object} selector - mongo selector object
   * @returns {Promise<IUser|null>} - the list of objects
   */
  async findOne(selector) {
    const obj = await this.Schema.findOne(selector);

    if (!obj) {
      return null;
    }

    return obj.toObject();
  }

  /**
   * Update a document(s)
   *
   * @param {Object} selector - mongo selector object
   * @param {Object} data - document info
   * @returns {Promise<Array<Object>>} - the list of documents
   */
  async update(selector, data) {
    await this.Schema.updateMany(selector, {
      $set: data
    });

    return this.find(selector);
  }

  /**
   * Remove a document(s)
   *
   * @param {Object} selector - mongo selector object
   * @returns {Promise<{n: number, ok: number}>} - an operation result
   */
  async remove(selector) {
    return await this.Schema.deleteMany(selector);
  }
}

module.exports = Crud;
