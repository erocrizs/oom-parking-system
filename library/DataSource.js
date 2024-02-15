class DataSource {
    getModel(tableName) {
        throw new Error('Unimplemented method');
    }
}

class DataModel {
    constructor(tableName) {
        this.tableName = tableName;
    }
    get(filters) {
        throw new Error('Unimplemented method');
    }
    getById(id) {
        throw new Error('Unimplemented method');
    }
    add(data) {
        throw new Error('Unimplemented method');
    }
    update(data, filter) {
        throw new Error('Unimplemented method');
    }
    updateById(id) {
        throw new Error('Unimplemented method');
    }
    delete(filter) {
        throw new Error('Unimplemented method');
    }
    deleteById(id) {
        throw new Error('Unimplemented method');
    }
}

module.exports = {
    DataSource,
    DataModel
}