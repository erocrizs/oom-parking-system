const _ = require('lodash');
const { DataSource, DataModel } = require('../library/DataSource');

const data = {
    SlotEntranceDistances: [],
    SlotSizes: [],
    Vehicles: [],
    Transactions: [],
};

class MockDataModel extends DataModel {
    #table = [];
    constructor(tableName) {
        super(tableName);
        this.#table = _.get(data, this.tableName);
    }
    get(filters) {
        const result = [];
        _.forEach(this.#table, (row, index) => {
            if (!_.isNil(row) && _.isMatch(row, filters)) {
                result.push({ id: index, data: _.cloneDeep(row) });
            }
        })
        return result;
    }
    getById(id) {
        return !_.isNil(this.#table[id]) ? { id, data: _.cloneDeep(this.#table[id]) } : null;
    }
    add(data) {
        data = _.cloneDeep(data);
        this.#table.push(data);
        return { id: this.#table.length - 1, data: _.cloneDeep(data) };
    }
    update(data, filter) {
        const affectedData = _.map(
            this.get(filter),
            ({id, data: originalData}) => ({
                id,
                data: _.assign({}, originalData, data)
            })
        );
        _.forEach(({id, data}) => _.set(this.#table, id, data));
        return affectedData;
    }
    updateById(data, id) {
        if (!_.has(this.#table, id)) {
            throw new Error('ID not found');
        }
        _.set(this.#table, id, data);
        return { id, data: _.cloneDeep(this.#table[id]) };
    }
    delete(filter) {
        const deletedRows = this.get(filter);
        _.forEach(deletedRows, ({id}) => _.unset(this.#table, id));
        return deletedRows;
    }
    deleteById(id) {
        const deletedRow = this.getById(id);
        _.unset(this.#table, deletedRow.id);
        return deletedRow;
    }
}

class MockDataSource extends DataSource {
    getModel(tableName) {
        return new MockDataModel(tableName);
    }
}

module.exports = MockDataSource;